import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuestionDetailsRequest } from 'src/app/Models/getQuestionDetailsRequest';
import { Answers } from 'src/app/Models/QuestionAnswers';
import { Question } from 'src/app/Models/QuestionModel';
import { QuestionnaireService } from 'src/app/service/Questionnaire.service';

interface DialogData {
  email: string;
}
@Component({
  selector: 'app-question-modal',
  templateUrl: './question-modal.component.html',
  styleUrls: ['./question-modal.component.css']
})
export class QuestionModalComponent implements OnInit {
  myGroup = new FormGroup({
    name: new FormControl("", [Validators.required]),
    
    active:new FormControl()
  });
  dataLoaded:boolean=true;
  constructor(
    public dialogRef: MatDialogRef<QuestionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData, private service:QuestionnaireService,private snack: MatSnackBar) {}

  onNoClick(): void { 
    this.dialogRef.close();
  }
  public question:Question ={ 
    questionId:null,
    title:'',
    questionnaireId: null,
    hasFeedback: false,
    questionAnswers: [],
    shortDescription:'',
    isMultiSelect:false
}
  public answers: Answers[] = [
    {id:null
      ,answerTitle:'',
   
     },
    
  ];
  request:QuestionDetailsRequest={
    questionId:null
  }
  ngOnInit() {
    if(this.data['new']==false)
    {
      this.question.questionId=this.data['questionId'];
this.request.questionId=this.data['questionId']

this.service.getQuestionDetailsWithAnswer(this.request).subscribe(
     
  res => {
    //console.log(res)
  this.dataLoaded=true;

  this.question.title=res['title']
  this.question.hasFeedback=res['hasFeedback']
  this.question.questionnaireId=res['questionnaireId']
  this.question.isMultiSelect=res['isMultiSelect']
  this.question.shortDescription=res['shortDescription']
  if(res['questionAnswers'].length>0)
  {
  this.answers=res['questionAnswers']
}
  }, e => {
    //console.log(e)
  this.dataLoaded=true;

  this.snack.open('Error pleas try again later', 'Failed',{
    duration: 5000
  });
  }

)

  
  
    }
else{
this.question.questionnaireId=this.data['questionnaireId']

}
//console.log('data ',this.data)

  }

  removeInput(index) {
    this.answers.splice(index,1)
    }
  words2 = [{value: 'word1'}, {value: 'word2'}, {value: 'word3'}, {value: ''}];
  
  add() {
    this.answers.push({id:null
      ,answerTitle:'',
   
     });
  }

  submit(){

//console.log(this.answers)
    if(this.question.title==null||this.question.title==''){
      this.snack.open('Title Required', 'Failed',{
        duration: 5000
      });
    }

    else if((this.answers==null||this.answers==[]||this.answers.length<=0)&&this.question.hasFeedback==false)
    {


      this.snack.open('Question must have answers or Feedback ', 'Failed',{
         duration: 5000
      });


    }

    else{


this.answers.forEach((row: Answers) =>
    {
      if(row.answerTitle=='')
      {

        this.snack.open('Answer required', 'Failed',{
          duration: 5000
       });

       return;
      }
    })
    this.question.questionAnswers=this.answers;

    this.dialogRef.close(this.question)
      }

   
   
  
  
    //console.log(' question ', this.question)
  }
    // this.service.addQuestion(this.question).subscribe(
    //   res => {
    //     //console.log(res)
      
    //   }, e => {
    //     //console.log(e)
      
    //   }
    
    // )
   // this.question.title=this.myGroup.get('name').value;
//this.question.hasFeedback=this.myGroup.get('active').value




  
}
