import { Component, Inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuestionModalComponent } from 'src/app/questions/question-modal/question-modal.component';
import { MedicalManagerService } from 'src/app/service/medical.service';
import { MedicalInfoDetailsById } from 'src/app/Models/MedicalInfoDetaildById';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-medicainfo',
  templateUrl: './modal-medicainfo.component.html',
  styleUrls: ['./modal-medicainfo.component.css']
})
export class ModalMedicainfoComponent implements OnInit {

  submittable = false;
  myGroup = new FormGroup({
    title: new FormControl("", [Validators.required]),
    description: new FormControl("", [Validators.required]),
    englishCategoryName:new FormControl(""),
    arabicCategoryName:new FormControl(""),
    active:new FormControl("")

    
  });

  dataLoaded: boolean = true;
  constructor(
    public dialogRef: MatDialogRef<QuestionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private medical: MedicalManagerService, private snack: MatSnackBar, public datepipe: DatePipe) { 

      //console.log(' this.submittable ', this.submittable )
      this.myGroup.valueChanges.subscribe(res => {
        if (this.myGroup.valid) {
          this.submittable = true;
          //console.log(this.myGroup.value)
        } else {
          this.submittable = false;
          //console.log(this.myGroup.value)
        }
      });
  



    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  medicalInfoId: number;
  offerUpload = false
  public medicalInfoDetails: MedicalInfoDetailsById =
    {

      id: null,
      title: '',
      description: '',
      imageName: '/assets/images/placeholder.jpg',
      videoName: '/assets/images/placeholder.jpg',
      active: false,
      arabicCategoryName: '',
      englishCategoryName: '',
      uploadFiles: false,
      uploadVideos: false
    }
  file: FileList;
  fileVideo: FileList;
  //filesMap : Map<string, File> = new Map<string, File>();

  ngOnInit() {

    //console.log('data ', this.data)

    this.medicalInfoId = this.data['medicalInfoId'];

    this.medical.getMedicalInfoDetailsById(this.medicalInfoId).subscribe(

      res => {
        this.dataLoaded = true;

        this.medicalInfoDetails = res;
        this.medicalInfoDetails.uploadFiles = false;
        this.medicalInfoDetails.uploadVideos = false;
        //console.log('this.medicalInfoDetails ', this.medicalInfoDetails)
        this.medicalInfoDetails.englishCategoryName = this.medicalInfoDetails.medicalInfoTopicCategoryDto.englishName

        this.medicalInfoDetails.arabicCategoryName = this.medicalInfoDetails.medicalInfoTopicCategoryDto.arabicName


      }, e => {
        //console.log(e)
        this.dataLoaded = true;

        this.snack.open('Error please try again later', 'Failed', {
          duration: 5000
        });
      }
    )
  }


  submit() {
    // this.medicalInfoDetails.isUploadFile = this.offerUpload
    // //console.log(this.medicalInfoDetails.isUploadFile)
    this.medicalInfoDetails.files = this.file
    this.medicalInfoDetails.filesVideo = this.fileVideo
    this.dialogRef.close(this.medicalInfoDetails)

    //console.log(' medical ', this.medicalInfoDetails)
  }


  onChange(event) {
    if (event.target.files[0] == null || event.target.files[0].length === 0)
      return;

    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.snack.open('Please, select an image', 'OK', {
        duration: 5000
      });
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.medicalInfoDetails.imageName = reader.result;
    }
    //console.log(event)
    this.medicalInfoDetails.uploadFiles = true;
    this.file = event.target.files[0];
    //console.log('event.target.files[0]', event.target.files[0])
    //console.log(this.file)
  }

  onChangeVideo(event) {
    if (event.target.files[0] == null || event.target.files[0].length === 0)
      return;

    var mimeType = event.target.files[0].type;
    if (mimeType.match(/video\/*/) == null) {
      this.snack.open('Please, select a video', 'OK', {
        duration: 5000
      });
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.medicalInfoDetails.videoName = reader.result;
    }
    //console.log(event)
    this.medicalInfoDetails.uploadVideos = true;
    this.fileVideo = event.target.files[0];
    //console.log(this.fileVideo)
  }

}
