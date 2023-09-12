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
import { JobDetailsById } from 'src/app/Models/JobDetailsById';
import { JobsService } from 'src/app/service/jobs.service';

@Component({
  selector: 'app-modal-jobs',
  templateUrl: './modal-jobs.component.html',
  styleUrls: ['./modal-jobs.component.css']
})
export class ModalJobsComponent implements OnInit {


  submittable = false;
  myGroup = new FormGroup({
    title: new FormControl("", [Validators.required]),
    description: new FormControl("", [Validators.required]),
    sendMailTo: new FormControl("", [Validators.required]),
    publishDate: new FormControl("", [Validators.required]),
    expiryDate: new FormControl("", [Validators.required]),
    active:new FormControl("")

    
  });

  dataLoaded: boolean = true;
  constructor(
    public dialogRef: MatDialogRef<ModalJobsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private jobs: JobsService, private snack: MatSnackBar, public datepipe: DatePipe) { 

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
  public jobsDetail: JobDetailsById =
    {

      id: null,
      title: '',
      description: '',
      sendMailTo:'',
      publishDate:'',
      expiryDate:'',
      imageName: '/assets/images/placeholder.jpg',
      docName: '',
      pdfName: '',
      active: false,
      uploadFiles: false,
      uploadDoc: false,
      uploadPdf:false
    }
  file: FileList;
  fileDoc: FileList;
  filePdf: FileList;
  //filesMap : Map<string, File> = new Map<string, File>();

  ngOnInit() {

    //console.log('data ', this.data)

    this.id = this.data['jobId'];

    //console.log(this.id)
    this.jobs.getJobAnnouncementById(this.id).subscribe(

      res => {
        this.dataLoaded = true;

        this.jobsDetail = res;
        this.jobsDetail.uploadFiles = false;
        this.jobsDetail.uploadDoc = false;
        this.jobsDetail.uploadPdf = false;
        //console.log('this.intiativesDetails ', this.jobsDetail)


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
    this.jobsDetail.files = this.file
    this.jobsDetail.filesDoc = this.fileDoc
    this.jobsDetail.filesPdf = this.filePdf
    this.dialogRef.close(this.jobsDetail)

    //console.log(' jobsDetail ', this.jobsDetail)
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
      this.jobsDetail.imageName = reader.result;
    }
    //console.log(event)
    this.jobsDetail.uploadFiles = true;
    this.file = event.target.files[0];
    //console.log('event.target.files[0]', event.target.files[0])
    //console.log(this.file)
  }

  onChangeDoc(event) {
    if (event.target.files[0] == null || event.target.files[0].length === 0)
      return;

    // var mimeType = event.target.files[0].type;
    // if (mimeType.match(/video\/*/) == null) {
    //   this.snack.open('Please, select a video', 'OK', {
    //     duration: 5000
    //   });
    //   return;
    // }

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.jobsDetail.docName = reader.result;
    }
    //console.log(event)
    this.jobsDetail.uploadDoc = true;
    this.fileDoc = event.target.files[0];
    //console.log(this.fileDoc)
  }


  onChangePdf(event) {
    if (event.target.files[0] == null || event.target.files[0].length === 0)
      return;

    // var mimeType = event.target.files[0].type;
    // if (mimeType.match(/video\/*/) == null) {
    //   this.snack.open('Please, select a video', 'OK', {
    //     duration: 5000
    //   });
    //   return;
    // }

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.jobsDetail.pdfName = reader.result;
    }
    //console.log(event)
    this.jobsDetail.uploadPdf = true;
    this.filePdf = event.target.files[0];
    //console.log(this.filePdf)
  }



}
