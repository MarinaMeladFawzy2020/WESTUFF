import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
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


interface DialogData {
  email: string;
}
@Component({
  selector: 'app-voting-modal',
  templateUrl: './voting-modal.component.html',
  styleUrls: ['./voting-modal.component.css']
})
export class VotingModalComponent implements OnInit {

  myGroup = new FormGroup({
    name: new FormControl("", [Validators.required]),
    
    active:new FormControl()
  });
  dataLoaded:boolean=true;
  //showAnswer: boolean=true;
  
  constructor(
    public dialogRef: MatDialogRef<QuestionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private service:VotingService,private snack: MatSnackBar,public datepipe: DatePipe) {}

  onNoClick(): void { 
    this.dialogRef.close();
  }

votingId:number;
public voting:VotingDetails=

{
  id:null,
  title:'',
  description: '',
  expiryDate: null,
  createdBy:'',
  publishDate:null,
  active:false,
  votingAnswer:null,
files:null
}


  public answers: votingAnswers[] = [];
  // [
  //   {
  //     id:null
  //     ,title:'',
  //     responseCount:null,
  //     mediaUrl:'/assets/images/placeholder.jpg',
  //     mediaName:null,
  //     uploadFiles:null,
  //     fullDescription:'',
  //     videoUrl:'/assets/images/placeholder.jpg',
  //     uploadVideos:null,
  //     videoName:null,
  //    },
    
  // ];
  request:QuestionDetailsRequest={
    questionId:null
  }

  @ViewChild('videoPlayer') videoplayer: ElementRef;    
    
  toggleVideo(event: any) {    
      this.videoplayer.nativeElement.play();    
  } 

  
  
  file:FileList[]=[];
   filesMap : Map<string, File> = new Map<string, File>();
  ngOnInit() {

    
    if(this.data['new']==false)
    {
     // this.showAnswer=false;
     this.votingId=this.data['votingId'];
//this.request.questionId=this.data['questionId']
//console.log('before ',this.voting);
this.service.getVotingDetailsWithAnswers(this.votingId).subscribe(
     
  res => {
    //console.log('after ',res)
  this.dataLoaded=true;

 this.voting=res;
 this.voting.publishDate=this.datepipe.transform(res.publishDate, 'yyyy-MM-dd\'T\'HH:mm');//'yyyy-MM-ddThh:mm'
 this.voting.expiryDate=this.datepipe.transform(res.expiryDate, 'yyyy-MM-dd\'T\'HH:mm');

  if(this.voting.votingAnswer.length>0)
  {
  this.answers=this.voting.votingAnswer
 // this.showAnswer=true;
}

  }, e => {
    //console.log(e)
  this.dataLoaded=true;

  this.snack.open('Error please try again later', 'Failed',{
    duration: 5000
  });
  }

)

  
  
    }
else{
  
  // this.showAnswer=false;
  // //console.log(this.showAnswer)
}
//console.log('data ',this.data)

  }

  removeInput(index) {
    this.answers.splice(index,1)
    }
  words2 = [{value: 'word1'}, {value: 'word2'}, {value: 'word3'}, {value: ''}];
  
  add() {
    //this.showAnswer=true;
    this.answers.push({id:null
      ,title:'',
   responseCount:0,
   mediaUrl:'/assets/images/placeholder.jpg',
   mediaName:null,
   uploadFiles:false,
   fullDescription:'',
   videoUrl:'/assets/images/placeholder.jpg',
   uploadVideos:false
     });
  }

  submit(){
    this.voting.votingAnswer=this.answers;
this.voting.files=this.filesMap;
    this.dialogRef.close(this.voting)

    // this.service.addQuestion(this.question).subscribe(
    //   res => {
    //     //console.log(res)
      
    //   }, e => {
    //     //console.log(e)
      
    //   }
    
    // )
   // this.question.title=this.myGroup.get('name').value;
//this.question.hasFeedback=this.myGroup.get('active').value


//console.log(' voting ', this.voting)

  }
  onChange(event,index) { 

    var reader = new FileReader();
    //this.imagePath = event.target.files;
    reader.readAsDataURL(event.target.files[0]); 
    reader.onload = (_event) => { 
      this.answers[index].mediaUrl = reader.result; 
    }
      //console.log(event)
    
    let filename='image'+index+1;
    this.filesMap.set(filename,event.target.files[0]);
   // this.file.push(event.target.files[0]);
    this.answers[index].mediaName=filename;
    this.answers[index].uploadFiles=true;
    //console.log(this.file)
    //console.log(this.answers)

}

onChangeVideo(event,index) { 

  var reader = new FileReader();
  //this.imagePath = event.target.files;
  reader.readAsDataURL(event.target.files[0]); 
  reader.onload = (_event) => { 
    this.answers[index].videoUrl = reader.result; 
  }
    //console.log(event)
  
  let filename='video'+index+1;
  this.filesMap.set(filename,event.target.files[0]);
  //this.file.push(event.target.files[0]);
  this.answers[index].videoName=filename;
  this.answers[index].uploadVideos=true;
  //console.log(this.file)
  //console.log(this.answers)

} 

}
