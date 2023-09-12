import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CorrespondenceDetailResponse } from 'src/app/Models/CorrespondenceDetailResponse';
import { QuestionModalComponent } from 'src/app/questions/question-modal/question-modal.component';
import { CorrespondenceService } from 'src/app/service/correspondence.service';

@Component({
  selector: 'app-modal-correspondence',
  templateUrl: './modal-correspondence.component.html',
  styleUrls: ['./modal-correspondence.component.css']
})
export class ModalCorrespondenceComponent implements OnInit {

  correspondenceId: number;
  dataLoaded: boolean = false;
  correspondenceUpload = false
  file: File = null;

  submittable = false;
  myGroup = new FormGroup({
    dataModel: new FormControl([], [Validators.required]),
    title: new FormControl("", [Validators.required]),
    correspondenceCategoryName:new FormControl(""),
    isActive: new FormControl("", [Validators.required]),
    uploadedFile: new FormControl(),
    sheet: new FormControl("", [Validators.required])
  });

  public correspondenceDetailResponse: CorrespondenceDetailResponse ={
    id: 0,
    title: '',
    isActive: null,
    correspondenceCategoryCustom: undefined,
    fileURL: null,
    addedDate: null,
    createdBy: '',
    uploadedFile: false

  };

  constructor(private correspondenceService: CorrespondenceService,
     public dialogRef: MatDialogRef<ModalCorrespondenceComponent>, private snack: MatSnackBar,
     @Inject(MAT_DIALOG_DATA) public data: any) {
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
  
  ngOnInit(): void {
    this.getCorrespondenceById();
  }

  getCorrespondenceById(){
    this.dataLoaded = false;
    //console.log('data ', this.data['correspondenceId'])
    this.correspondenceId = this.data['correspondenceId'];

    this.correspondenceService.getCorrespondenceById(this.correspondenceId).subscribe(
      res => {
        this.correspondenceDetailResponse = res;
       // //console.log('res =  ', res)
        this.dataLoaded = true;
      }, e => {
        //console.log(e)
        this.snack.open('Error please try again later', 'Failed', {
          duration: 5000
        });
        this.dataLoaded = true;
      }
    )
  }

  submit() {
    this.correspondenceDetailResponse.uploadedFile = this.correspondenceUpload
    this.correspondenceDetailResponse.fileURL = this.file
    this.dialogRef.close(this.correspondenceDetailResponse)
  }

  onChange(event) {
    if (event.target.files[0].length === 0)
      return;
    this.correspondenceUpload = true
    this.file = event.target.files[0]; 
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
