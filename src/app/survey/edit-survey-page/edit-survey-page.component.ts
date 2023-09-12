import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AddQuestionaireRequest } from 'src/app/Models/AddQuestionaireRequest';
import { Question } from 'src/app/Models/QuestionModel';
import { QuestionnaireService } from 'src/app/service/Questionnaire.service';
import { SurveyService } from 'src/app/service/survey.service';
import { QuestionModalComponent } from '../../questions/question-modal/question-modal.component';
import { SurveyQuestionsModalComponent } from './survey-questions-modal/survey-questions-modal.component';
@Component({
  selector: 'app-edit-survey-page',
  templateUrl: './edit-survey-page.component.html',
  styleUrls: ['./edit-survey-page.component.css']
})
export class EditSurveyPageComponent implements OnInit {


  email: string;
  dataLoaded: boolean = false;
  question: Question = {
    questionId: null,
    title: null,
    questionnaireId: null,
    hasFeedback: false,
    questionAnswers: [{
      id: null
      , answerTitle: null,

    }

    ]
  }


  pageLength = 5;
  dataLength: number;
  start = 0;
  end: number;
  filterStart = 0;
  filterSize = 5;
  isFilter = false;
  filterArray;



  surveyId: number
  errorMsg;
  serviceError = false;
  sortedData = [];
  submittable = false;
  dataSource: any;
  defaultData: any;
  modalMsg;
  modalHeaderMsg;
  returnedMsg;
  actionDone: boolean = false;
  @ViewChild('paginator') paginator: MatPaginator;

  @ViewChild('divfocus') divfocus: ElementRef;
  @ViewChild('divErrorfocus') divErrorfocus: ElementRef;
  myGroup = new FormGroup({
    title: new FormControl("", [Validators.required]),
    description: new FormControl("", [Validators.required]),
    publishDate: new FormControl("", [Validators.required]),
    expiryDate: new FormControl("", [Validators.required]),
    active: new FormControl("",),
    // overallFeedback: new FormControl("", )
  });
  
  pDate;
  expDate;
  questionnaire: any;
  editedSurvey: any;
  constructor(public dialog: MatDialog, private service: SurveyService, private snack: MatSnackBar, private activatedRoute: ActivatedRoute, private route: Router, public datepipe: DatePipe) {


    this.myGroup.valueChanges.subscribe(res => {
      if (this.myGroup.valid) {
        this.submittable = true;
        //console.log(this.myGroup.value)
      } else {
        this.submittable = false;
      }
    });

    this.activatedRoute.paramMap.pipe(map(() => window.history.state))
      .subscribe(async (data) => {
        // //console.log('BranchComponent')
        //console.log(data);
        if (data.navigationId == 1) {
          this.route.navigateByUrl("/survey")
        } else {
          //  this.questionnaireId = data.questionnaireId;
          this.surveyId = data.surveyId
          //console.log(data['name']);


          this.service.getSurveyInfoById(this.surveyId).subscribe(

            Response => {
              this.dataLoaded = true;
              this.questionnaire = Response
              this.pDate = this.questionnaire.publishDate
              this.expDate = this.questionnaire.expiryDate
              let pubDate = this.datepipe.transform(this.pDate, 'yyyy-MM-dd\'T\'HH:mm');// 'yyyy-MM-ddThh:mm'
              let exDate = this.datepipe.transform(this.expDate, 'yyyy-MM-dd\'T\'HH:mm');

              this.myGroup.get('title').setValue(this.questionnaire.title);
              this.myGroup.get('description').setValue(this.questionnaire.description);
              //this.myGroup.get('addingDate').setValue(this.questionnaire.addingDate);
              this.myGroup.get('publishDate').setValue(pubDate);
              this.myGroup.get('expiryDate').setValue(exDate);

              this.myGroup.get('active').setValue(this.questionnaire.active);
              // this.myGroup.get('overallFeedback').setValue(this.questionnaire.overallFeedback);
            },
            e => {
              //console.log(e)
              this.serviceError = true;
              if (e['status'] == 500) {
                this.errorMsg = e.error['message']
              } else {
                this.errorMsg = 'Service not avaliable,Try again later.'
              }
              this.goToDivErrorMsg();
            }

          );



          //this.updateTable(this.start, this.pageLength, '', this.branchManagerId);
        }


      });
  }

  ngOnInit(): void {

    this.updateTable(this.start, this.pageLength, '');

  }

  openDialog(isNew?, id?): void {

    let data = this.question
    let title = isNew ? 'Add New Question' : 'Edit Question';
    const dialogRef = this.dialog.open(SurveyQuestionsModalComponent, {
      width: '700px',
      data: { title: title, payload: data, new: isNew, questionId: id, surveyId: this.surveyId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        // If user press cancel
        return;
      }
      if (isNew) {
        this.dataLoaded = false;
        this.service.addQuestion(result).subscribe(

          res => {
            //console.log(res)
            this.dataLoaded = true;

            this.snack.open('Question Added Successfully', 'OK', {
              duration: 5000
            });

            this.updateTable(this.start, this.pageLength, '');

          }, e => {
            //console.log(e)
            this.dataLoaded = true;

            this.snack.open('Error pleas try again later', 'Failed', {
              duration: 5000
            });
          }

        )


      }
      else {
        this.dataLoaded = false;
        this.service.editQuestion(result).subscribe(

          res => {
            //console.log(res)
            this.dataLoaded = true;

            this.updateTable(this.start, this.pageLength, '');
            this.snack.open('Question Updated Successfully', 'OK', {
              duration: 5000
            });


          }, e => {
            //console.log(e)
            this.dataLoaded = true;

            this.snack.open('Error pleas try again later', 'Failed', {
              duration: 5000
            });
          }

        )


      }




      //console.log(result)
    });
  }
  goToDivErrorMsg() {
    setTimeout(() => {
      // //console.log(this.divfocus.nativeElement)
      this.divErrorfocus.nativeElement.scrollIntoView();

    }, 0);
  }
  resetForm() {


    this.myGroup.reset()
    this.submittable = false;

  }
  goToDivMsg() {
    setTimeout(() => {
      // //console.log(this.divfocus.nativeElement)
      this.divfocus.nativeElement.scrollIntoView();

    }, 0);
  }

  EditSurvey() {
    this.dataLoaded = false;
    this.serviceError = false;
    this.actionDone = false;

    this.editedSurvey = {
      id: this.questionnaire.id,
      title: this.myGroup.get('title').value,
      description: this.myGroup.get('description').value,
      expiryDate: this.myGroup.get('expiryDate').value,
      publishDate: this.myGroup.get('publishDate').value,
      active: this.myGroup.get('active').value,
      // overallFeedback:this.myGroup.get('overallFeedback').value,

      /////////


    }

    this.service.editSurveyInfo(this.editedSurvey).subscribe(
      res => {
        //console.log(res)
        this.dataLoaded = true;
        this.actionDone = true;
        this.returnedMsg = "Survey Edited Succssfully"
        this.goToDivMsg();
      }, e => {
        this.dataLoaded = true;
        this.serviceError = true;
        if (e['status'] == 500) {
          this.errorMsg = e.error['message']
        } else {
          this.errorMsg = 'Service not avaliable now,Try again later.'
        }
        this.goToDivErrorMsg();
      }
    )

  }

  updateTable(start, limit, searchText) {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false

    //console.log('get all questions ')
    //call service getBranchManagersList
    this.service.getAllQuestionsTopicById(this.surveyId, start, limit, searchText).subscribe(
      res => {
        //console.log(res)
        this.dataLength = res['totalCount'];

        this.dataSource = res['questions'];
        //this.dataSource = res;

        this.defaultData = res;
        this.dataLoaded = true;
        this.filterArray = new MatTableDataSource(this.defaultData);
      }, e => {
        //console.log(e)
        this.dataLoaded = true;
        this.serviceError = true;
        if (e['status'] == 500) {
          this.errorMsg = e.error['message']
        } else {
          this.errorMsg = 'Service not avaliable,Try again later.'
        }
        this.goToDivErrorMsg();
      }
    )
  }

  filterText
  updatePage(event) {
    this.actionDone = false
    this.serviceError = false

    // //console.log('isFilter ' + this.isFilter)

    if (!this.isFilter) {
      this.filterStart = 0;

      this.start = event.pageIndex;
      this.end = this.pageLength;
      // //console.log('start ' + this.start + ' limit ' + this.pageLength)
      this.updateTable(this.start, this.end, '');
    } else {
      this.start = 0

      this.filterStart = event.pageIndex;
      this.end = this.filterSize;
      // //console.log('start ' + this.filterStart + ' limit ' + this.filterSize)
      this.updateTable(this.filterStart, this.pageLength, this.filterText);
    }
  }

  applyFilter(event) {

    this.actionDone = false
    this.serviceError = false
    this.serviceError = false

    var filterValue = event.target.value
    var keyPress = event.key
    //console.log('applyFilter ' + filterValue.trim().toLowerCase())
    this.filterText = filterValue.trim().toLowerCase();

    if (keyPress === "Enter") {

      this.paginator.pageIndex = 0;
      this.filterStart = 0;
      this.isFilter = true
      this.updateTable(this.filterStart, this.pageLength, this.filterText);
    }
    if (!this.filterText) {

      // //console.log('no filter')
      this.paginator.pageIndex = 0;
      this.start = 0;
      this.isFilter = false;
      this.updateTable(this.start, this.pageLength, '');
    }
  }
  deleteId: any;
  selectedDeleteRow(data: any) {
    this.actionDone = false;
    this.serviceError = false

    this.deleteId = data.id;
    this.modalMsg = "Are you sure you want to delete this Question : " + data.title + "?"
    //console.log('this.delete id ' + this.deleteId);
  }

  deleteSelectedRow() {



    this.service.deleteQuestions(this.deleteId).subscribe(
      (response) => {
        this.dataLoaded = true;
        //after delete get new data from database 
        this.updateTable(this.start, this.pageLength, '');
        this.returnedMsg = response['englishMessage']
        this.actionDone = response['actionDone'];
        this.snack.open(this.returnedMsg, 'OK', {
          duration: 4000
        });
        //  this.goToDivMsg();
      }, (e) => {
        //console.log('error');
        //console.log(e);
        this.dataLoaded = true;
        this.serviceError = true;
        if (e['status'] == 500) {
          this.errorMsg = e.error['message']
        } else {
          this.errorMsg = 'Service not avaliable now,Try again later.'
        }
        this.snack.open(this.errorMsg, 'Failed', {
          duration: 4000
        });
        // this.goToDivErrorMsg();
      }
    );
  }


}
