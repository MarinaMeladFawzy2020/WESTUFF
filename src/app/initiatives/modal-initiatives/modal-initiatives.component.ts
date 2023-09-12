import { Component, Inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuestionModalComponent } from 'src/app/questions/question-modal/question-modal.component';
import { MedicalManagerService } from 'src/app/service/medical.service';
import { MedicalInfoDetailsById } from 'src/app/Models/MedicalInfoDetaildById';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IntiativesDetailsById } from 'src/app/Models/IntiativesById';
import { IntiativesService } from 'src/app/service/initiatives.service';

interface DialogData {
  email: string;
}

@Component({
  selector: 'app-modal-initiatives',
  templateUrl: './modal-initiatives.component.html',
  styleUrls: ['./modal-initiatives.component.css']
})
export class ModalInitiativesComponent implements OnInit {

  submittable = false;
  myGroup = new FormGroup({
    title: new FormControl("", [Validators.required]),
    description: new FormControl("", [Validators.required]),
    publishDate: new FormControl("", [Validators.required]),
    englishCategoryName:new FormControl(""),
    arabicCategoryName:new FormControl(""),
    active:new FormControl("")

    
  });

  dataLoaded: boolean = true;
  constructor(
    public dialogRef: MatDialogRef<ModalInitiativesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private intiatives: IntiativesService, private snack: MatSnackBar, public datepipe: DatePipe) { 

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
  id: number;
  offerUpload = false
  public intiativesDetails: IntiativesDetailsById =
    {

      id: null,
      title: '',
      description: '',
      publishDate:'',
      imageName: '/assets/images/placeholder.jpg',
      videoName: '/assets/images/placeholder.jpg',
      active: false,
      uploadFiles: false,
      uploadVideos: false
    }
  file: FileList;
  fileVideo: FileList;
  //filesMap : Map<string, File> = new Map<string, File>();

  ngOnInit() {

    //console.log('data ', this.data)

    this.id = this.data['intiativesId'];

    //console.log(this.id)
    this.intiatives.getInitiativeById(this.id).subscribe(

      res => {
        this.dataLoaded = true;

        this.intiativesDetails = res;
        this.intiativesDetails.uploadFiles = false;
        this.intiativesDetails.uploadVideos = false;
        //console.log('this.intiativesDetails ', this.intiativesDetails)


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
    this.intiativesDetails.files = this.file
    this.intiativesDetails.filesVideo = this.fileVideo
    this.dialogRef.close(this.intiativesDetails)

    //console.log(' medical ', this.intiativesDetails)
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
      this.intiativesDetails.imageName = reader.result;
    }
    //console.log(event)
    this.intiativesDetails.uploadFiles = true;
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
      this.intiativesDetails.videoName = reader.result;
    }
    //console.log(event)
    this.intiativesDetails.uploadVideos = true;
    this.fileVideo = event.target.files[0];
    //console.log(this.fileVideo)
  }

}
