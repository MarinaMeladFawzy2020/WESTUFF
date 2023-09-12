import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { EditvotingAnswersRequest } from 'src/app/Models/EditVotingAnswersRequest';
import { EditVotingRequest } from 'src/app/Models/EditVotingRequest';
import { Question } from 'src/app/Models/QuestionModel';
import { votingAnswersRequest } from 'src/app/Models/VotingAnswerRequest';
import { votingAnswers } from 'src/app/Models/VotingAnswers';
import { VotingDetails } from 'src/app/Models/VotingDetails';
import { VotingRequest } from 'src/app/Models/VotingRequest';
import { QuestionModalComponent } from 'src/app/questions/question-modal/question-modal.component';
import { AuthService } from 'src/app/service/auth.service';
import { QuestionnaireService } from 'src/app/service/Questionnaire.service';
import { VotingService } from 'src/app/service/voting.service';
import { config } from 'src/config';
import { VotingModalComponent } from '../voting-modal/voting-modal.component';

@Component({
  selector: 'app-voting-list',
  templateUrl: './voting-list.component.html',
  styleUrls: ['./voting-list.component.css']
})
export class VotingListComponent implements OnInit {


  votingReq: VotingRequest = {
    id: null,
    title: '',
    description: '',
    expiryDate: null,
    publishDate: null,
    active: false,
    votingAnswer: [],
  };
  EditvotingReq: EditVotingRequest = {
    id: null,
    title: '',
    description: '',
    expiryDate: null,
    publishDate: null,
    active: false,
    votingAnswer: [],
  };
  email: string;
  dataLoaded: boolean = false;
  question: Question = {
    questionId: null,
    title: null,
    questionnaireId: null,
    hasFeedback: false,
    questionAnswers: [{
      id: null,
      answerTitle: null,
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
  questionnaireId: number
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
  questionnaire: any;
  editedQuestionnaire: any;
  add: boolean;
  view: boolean;
  constructor(private authSerivce: AuthService, public dialog: MatDialog, private service: VotingService, private snack: MatSnackBar, private activatedRoute: ActivatedRoute, private route: Router) {



  }
  ngOnInit(): void {

    this.updateTable(this.start, this.pageLength, '');

  }

  openDialog(isNew?, id?, data?): void {
    //  let data=this.question
    let dialogRef;

    let title = isNew ? 'Add New Voting' : 'Edit Voting';
    if (isNew) {
      dialogRef = this.dialog.open(VotingModalComponent, {
        width: '700px',
        data: { title: title, payload: data, new: isNew, votingId: id }
      });
    }

    else {
      if (this.authSerivce.getUserRoles().filter(item => config.authRoles.Voting.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.edit).length == 0) {
        this.snack.open('You do not have access to edit ', 'OK', {
          duration: 5000
        });
      }
      else {
        //console.log('edit ', data.editable)
        if (data.editable == false) {

          this.snack.open('You can not edit this voting because it is published', 'Failed', {
            duration: 5000
          });
        }
        else {
          dialogRef = this.dialog.open(VotingModalComponent, {
            width: '700px',
            data: { title: title, payload: data, new: isNew, votingId: id }
          });
        }
      }
    }


    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        // If user press cancel
        return;
      }
      if (isNew) {
        this.dataLoaded = false;
        this.votingReq.id = result.id;
        this.votingReq.title = result.title;
        this.votingReq.description = result.description
        this.votingReq.publishDate = result.publishDate;
        this.votingReq.expiryDate = result.expiryDate;
        this.votingReq.active = result.active;
        //this.votingReq.votingAnswer=result.votingAnswer



        result.votingAnswer.forEach((row: any) => {
          let votingAnswer: votingAnswersRequest = { title: '', mediaUrl: '', videoUrl: '', fullDescription: '' };
          votingAnswer.title = row.title;
          votingAnswer.mediaUrl = row.mediaName;
          votingAnswer.videoUrl = row.videoName;
          votingAnswer.fullDescription = row.fullDescription;
          this.votingReq.votingAnswer.push(votingAnswer);
        })
        //console.log('lll ', this.votingReq)
        this.service.addVoting(this.votingReq, result).subscribe(


          res => {
            //console.log(res)
            this.dataLoaded = true;

            this.snack.open('Voting Added Successfully', 'OK', {
              duration: 5000
            });

            this.updateTable(this.start, this.pageLength, '');

          }, e => {
            //console.log(e)
            this.dataLoaded = true;

            this.snack.open(e.error.message, 'Failed', {
              duration: 5000
            });
          }

        )

        this.votingReq = {
          id: null,
          title: '',
          description: '',
          expiryDate: null,
          publishDate: null,
          active: false,
          votingAnswer: [],
        };
      }
      else {
        this.dataLoaded = false;

        this.EditvotingReq.id = result.id;
        this.EditvotingReq.title = result.title;
        this.EditvotingReq.description = result.description
        this.EditvotingReq.publishDate = result.publishDate;
        this.EditvotingReq.expiryDate = result.expiryDate;
        this.EditvotingReq.active = result.active;
        //this.votingReq.votingAnswer=result.votingAnswer



        result.votingAnswer.forEach((row: any) => {
          let votingAnswer: EditvotingAnswersRequest = {
            id: null, title: '', mediaUrl: '', uploadFiles: null,
            fullDescription: '', videoUrl: '', uploadVideos: null
          };
          votingAnswer.id = row.id
          votingAnswer.title = row.title;
          votingAnswer.mediaUrl = row.mediaName;
          votingAnswer.uploadFiles = row.uploadFiles
          votingAnswer.fullDescription = row.fullDescription
          votingAnswer.videoUrl = row.videoName
          votingAnswer.uploadVideos = row.uploadVideos
          this.EditvotingReq.votingAnswer.push(votingAnswer);
        })
        //console.log('lll ', this.EditvotingReq)
        this.service.editVoting(this.EditvotingReq, result).subscribe(

          res => {
            //console.log(res)
            this.dataLoaded = true;

            this.updateTable(this.start, this.pageLength, '');
            this.snack.open('Voting Updated Successfully', 'OK', {
              duration: 5000
            });


          }, e => {
            //console.log(e)
            this.dataLoaded = true;

            this.snack.open(e.error.message, 'Failed', {
              duration: 5000
            });
          }

        )
        this.EditvotingReq = {
          id: null,
          title: '',
          description: '',
          expiryDate: null,
          publishDate: null,
          active: false,
          votingAnswer: [],
        };

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

  goToDivMsg() {
    setTimeout(() => {
      // //console.log(this.divfocus.nativeElement)
      this.divfocus.nativeElement.scrollIntoView();

    }, 0);
  }


  updateTable(start, limit, searchText) {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false

    //console.log('get all votings ')
    //call service getBranchManagersList
    this.service.getAllVoting(start, limit, searchText).subscribe(
      res => {
        //console.log(res)
        this.dataLength = res['totalCount'];

        this.dataSource = res['votingTopicDtosList'];
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
    this.service.deleteVoting(this.deleteId).subscribe(
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

  viewAllQuestions(data) {
    ////console.log(this.authSerivce.getUserRoles().filter(item=>config.authRoles.UserManagement.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.add).length)
    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.Voting.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.view).length == 0) {
      this.snack.open('You do not have access to this page!', 'OK', {
        duration: 5000
      });
    } else {
      //console.log('edit' + data.id)
      this.route.navigateByUrl("/votingStatisticsById"
        , { state: { votingId: data.id, name: data.name } });
    }
  }


  
  isActivate;
  checkedId;
  selectedCheckedRow(data, checked) {
    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.Questionaire.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.edit).length == 0) {
      this.snack.open('You do not have access to this page!', 'OK', {
        duration: 5000
      });
    }
    this.actionDone = false;
    this.serviceError = false

     ////console.log("select checked row...",data);
    this.checkedId = data.id;
    //console.log(checked)
    this.isActivate = checked
    //console.log("isActivate : "+this.isActivate)
    //console.log(data);
    if (this.isActivate) {
      this.modalMsg = "Are you sure you want to activate this Questionaire: " + data.title + "?"
      this.modalHeaderMsg = "Activate";
    } else {
      this.modalMsg = "Are you sure you want to deactivate this Questionaire: " + data.title + "?"
      this.modalHeaderMsg = "Deactivate";
    }
  }

  ActivateDeactivateSelectedRow() {
    this.dataLoaded = false;
    this.actionDone = false;

    this.serviceError = false

    if (this.isActivate) {
      this.service.activateDeActivateVoting(this.isActivate,this.checkedId).subscribe(
        (response) => {
          this.dataLoaded = true;
          //after delete get new data from database 
          this.updateTable(this.start, this.pageLength, '');
          this.returnedMsg = response['englishMessage']
          this.actionDone = response['actionDone'];
          this.snack.open(this.returnedMsg, 'OK',{
            duration: 4000
          });
         // this.goToDivMsg();
        }, (e) => {
          // //console.log('error');
          //console.log(e);
          this.dataLoaded = true;
          this.serviceError = true;
          if (e['status'] == 500) {
            this.errorMsg = e.error['message']
          } else {
            this.errorMsg = 'Service not avaliable now,Try again later.'
          }
          this.snack.open(this.errorMsg, 'Failed',{
            duration: 4000
          });
        //  this.goToDivErrorMsg();
        }
      );
    } else {
      this.service.activateDeActivateVoting(this.isActivate,this.checkedId).subscribe(
        (response) => {
          this.dataLoaded = true;
          //after delete get new data from database 
          this.updateTable(this.start, this.pageLength, '');
          this.returnedMsg = response['englishMessage']
          this.actionDone = response['actionDone'];
          this.snack.open(this.returnedMsg, 'OK',{
            duration: 4000
          });
          // this.goToDivMsg();
        }, (e) => {
          // //console.log('error');
          //console.log(e);
          this.dataLoaded = true;
          this.serviceError = true;
          if (e['status'] == 500) {
            this.errorMsg = e.error['message']
          } else {
            this.errorMsg = 'Service not avaliable now,Try again later.'
          }
          this.snack.open(this.errorMsg, 'Failed',{
            duration: 4000
          });
         // this.goToDivErrorMsg();
        }
      );
    }
  }


}
