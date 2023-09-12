import { Component, Inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuestionDetailsRequest } from 'src/app/Models/getQuestionDetailsRequest';
import { Answers } from 'src/app/Models/QuestionAnswers';
import { Question } from 'src/app/Models/QuestionModel';
import { votingAnswers } from 'src/app/Models/VotingAnswers';
import { VotingDetails } from 'src/app/Models/VotingDetails';
import { QuestionModalComponent } from 'src/app/questions/question-modal/question-modal.component';
import { QuestionnaireService } from 'src/app/service/Questionnaire.service';
import { VotingService } from 'src/app/service/voting.service';
import { BannerDetail } from 'src/app/Models/BannerDetail';
import { BannersService } from 'src/app/service/banner.service';
import { EditBanner } from 'src/app/Models/EditBanner';

interface DialogData {
  email: string;
}

@Component({
  selector: 'app-modal-banner',
  templateUrl: './modal-banner.component.html',
  styleUrls: ['./modal-banner.component.css']
})


export class ModalBannerComponent implements OnInit {


  dataLoaded: boolean = true;

  submittable = false;
  myGroup = new FormGroup({
    title: new FormControl("", [Validators.required]),
    bannerTypeName:new FormControl(""),
    publishDate: new FormControl("", [Validators.required]),
    expiryDate:new FormControl("", [Validators.required]),
    orderNo:new FormControl("", [Validators.required]),
    active:new FormControl("")

    
  });


  constructor(
    public dialogRef: MatDialogRef<QuestionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private service: BannersService, private snack: MatSnackBar, public datepipe: DatePipe) {


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

  bannerUpload = false
  public banner: BannerDetail =
    {
      bannerTypeId: null,
      bannerId: null,
      title: '',
      bannerMediaName: '',
      bannerTypeName: '',
      expiryDate: null,
      itemId: null,
      orderNo: null,
      publishDate: null,
      active: false,
      isUploadFile: false
    }

  // editBanner:EditBanner;
  // public answers: votingAnswers[] = [
  //   {id:null
  //     ,title:'',
  //     responseCount:null,
  //     mediaUrl:'/assets/images/placeholder.jpg',
  //     uploadFiles:null
  //    },

  // ];
  // request:QuestionDetailsRequest={
  //   questionId:null
  // }

  file: FileList;
  ngOnInit() {

    //     if(this.data['new']==false)
    //     {
    //      this.votingId=this.data['votingId'];
    // //this.request.questionId=this.data['questionId']
    // //console.log('before ',this.voting);
    // this.service.getVotingDetailsWithAnswers(this.votingId).subscribe(

    //   res => {
    //     //console.log('after ',res)
    //   this.dataLoaded=true;

    //  this.voting=res;
    //  this.voting.publishDate=this.datepipe.transform(res.publishDate, 'yyyy-MM-ddThh:mm');
    //  this.voting.expiryDate=this.datepipe.transform(res.expiryDate, 'yyyy-MM-ddThh:mm');

    //   if(this.voting.votingAnswer.length>0)
    //   {
    //   this.answers=this.voting.votingAnswer
    // }
    //   }, e => {
    //     //console.log(e)
    //   this.dataLoaded=true;

    //   this.snack.open('Error please try again later', 'Failed',{
    //     duration: 5000
    //   });
    //   }

    // )



    //     }
    // else{

    // }
    //console.log('data ', this.data)

    this.banner = this.data.payload;
    this.banner.publishDate = this.datepipe.transform(this.data.payload.publishDate, 'yyyy-MM-dd\'T\'HH:mm');
    this.banner.expiryDate = this.datepipe.transform(this.data.payload.expiryDate, 'yyyy-MM-dd\'T\'HH:mm');//'yyyy-MM-ddThh:mm'
  }



  submit() {
    this.banner.isUploadFile = this.bannerUpload
    //console.log(this.banner.isUploadFile)
    this.banner.files = this.file
    this.dialogRef.close(this.banner)

    //console.log('lll ', this.banner)
    //console.log(' banner ', this.banner)

  }
  onChange(event) {

    if (event.target.files[0].length === 0)
      return;

    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }


    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.banner.bannerMediaName = reader.result;
    }
    //console.log(event)
    this.bannerUpload = true;
    this.file = event.target.files[0];
    //console.log('event.target.files[0]', event.target.files[0])
    //console.log(this.file)

  }





}
