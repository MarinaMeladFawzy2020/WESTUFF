import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NotificationsService } from 'src/app/service/notifications.service';
import { QuestionaireService } from 'src/app/service/questionaire.service';
import { config } from 'src/config';
import { AuthService } from '../../service/auth.service';


@Component({
  selector: 'app-questionnaire-list',
  templateUrl: './questionnaire-list.component.html',
  styleUrls: ['./questionnaire-list.component.css']
})
export class QuestionsListComponent implements OnInit {

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('divErrorfocus') divErrorfocus: ElementRef;
  @ViewChildren("CheckBoxForm") checkBoxs: QueryList<MatCheckbox>;
  @ViewChild('divfocus') divfocus: ElementRef;

  pageLength = 5;
  dataLength: number;
  start = 0;
  end: number;
  filterStart = 0;
  filterSize = 5;
  isFilter = false;

  pageEvent: PageEvent;
  filterArray;
  errorMsg;
  serviceError = false;
  sortedData = [];
  dataLoaded = false;
  submittable = false;
  dataSource: any;
  defaultData: any;
  modalMsg;
  modalHeaderMsg;
  returnedMsg;
  //ecrmAccountNo;
  rolesList: any;
  entitySpocPersonId;
  // myGroup = new FormGroup({
  //   name: new FormControl("", [Validators.required]),
  //   username: new FormControl("", [Validators.required]),
  //   email: new FormControl("", [Validators.required, Validators.email]),
  //   mobilenumber: new FormControl("", [Validators.required, , Validators.pattern(new RegExp(/^(01)(0|1|2|5)[0-9]{8}/))]),
  //   dataModel: new FormControl([], [Validators.required]),
  //   rolesCheck: new FormControl([]),
  // });
  rolesCheck = [];
  Modules: any;
  selected = -1;
  selectedTopicId;
  filterText = '';
  topicID;

  // selectionChanged(event){
  //    //console.log('drop down ',event.value.id)
  //    this.selected=event.value.id;
  //    //console.log(this.selected)
  //    //console.log(this.filterText)
  //     if(this.filterText)
  //     {
  //    this.updateTable(this.start, this.pageLength,'',this.selected);
  //      }else
  //      this.updateTable(this.start, this.pageLength, this.filterText,this.selected);
  // }



  actionDone: boolean = false;
  constructor(private questionaireService: QuestionaireService
    , private router: Router, private authSerivce: AuthService, private snack: MatSnackBar) { }

  async ngOnInit(): Promise<void> {

    this.updateTable(this.start, this.pageLength, '');



  }





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
  updateTable(start, limit, searchText) {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false
    // change service to call notification List
    //console.log('getBranchManagersList')
    //call service getBranchManagersList
    this.questionaireService.getAllQuestionaire(start, limit, searchText).subscribe(
      res => {
        //console.log(res)
        this.dataLength = res['totalCount'];

        this.dataSource = res['allQuestionnaireTopicDto'];
        //this.dataSource = res;
        //this.dataSource.notificationTopic.name;

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
  applyFilter(event) {

    this.actionDone = false
    this.serviceError = false
    this.serviceError = false

    var filterValue = event.target.value
    var keyPress = event.key
    //console.log('applyFilter ' + filterValue.trim().toLowerCase())
    this.filterText = filterValue.trim().toLowerCase();
    //console.log('selecteddddddd', this.selected)
    if (keyPress === "Enter") {

      this.paginator.pageIndex = 0;
      this.filterStart = 0;
      this.isFilter = true
      // if(this.selected==-1)
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



  goToDivMsg() {
    setTimeout(() => {
      ////console.log(this.divfocus.nativeElement)
      this.divfocus.nativeElement.scrollIntoView();

    }, 0);
  }

  goToDivErrorMsg() {
    setTimeout(() => {
      // //console.log(this.divfocus.nativeElement)
      this.divErrorfocus.nativeElement.scrollIntoView();

    }, 0);
  }

  onAddedTransfer(event) {

    //console.log(event);
    this.updateTable(this.start, this.pageLength, '');

  }

  editQuestionaire(data) {
    ////console.log(this.authSerivce.getUserRoles().filter(item=>config.authRoles.UserManagement.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.add).length)
    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.Questionaire.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.edit).length == 0) {
      this.snack.open('You do not have access to this page!', 'OK', {
        duration: 5000
      });
    } else {
      if (data.editable == false) {

        this.snack.open('You can not edit this topic because it is published', 'Failed', {
          duration: 5000
        });

      }
      else {
        //console.log('edit' + data.id)
        this.router.navigateByUrl("/edit"
          , { state: { questionnaireId: data.id, name: data.name } });
      }
    }
  }


  viewAllQuestions(data) {
    ////console.log(this.authSerivce.getUserRoles().filter(item=>config.authRoles.UserManagement.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.add).length)
    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.Questionaire.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.view).length == 0) {
      this.snack.open('You do not have access to this page!', 'OK', {
        duration: 5000
      });
    } else {
      //console.log('edit' + data.id)
      this.router.navigateByUrl("/questions-statistics"
        , { state: { questionnaireId: data.id, name: data.name } });
    }
  }

  deleteId: any;
  selectedDeleteRow(data: any) {
    this.actionDone = false;
    this.serviceError = false

    this.deleteId = data.id;
    this.modalMsg = "Are you sure you want to delete this Questionnaire : " + data.title + "?"
    //console.log('this.delete id ' + this.deleteId);

  }

  deleteSelectedRow() {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false


    this.questionaireService.deleteQuestionnaire(this.deleteId).subscribe(
      (response) => {
        this.dataLoaded = true;
        //after delete get new data from database 
        this.updateTable(this.start, this.pageLength, '');
        this.returnedMsg = response['englishMessage']
        this.actionDone = response['actionDone'];
        this.snack.open('Action Performed Successfully', 'OK', {
          duration: 4000
        });
        //this.goToDivMsg();
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
        this.goToDivErrorMsg();
      }
    );
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
      this.questionaireService.activateDeActivateQuestionaire(this.isActivate,this.checkedId).subscribe(
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
      this.questionaireService.activateDeActivateQuestionaire(this.isActivate,this.checkedId).subscribe(
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
