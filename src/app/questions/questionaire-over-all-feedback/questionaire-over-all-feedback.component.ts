import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { NotificationsService } from 'src/app/service/notifications.service';
import { QuestionaireService } from 'src/app/service/questionaire.service';
import { config } from 'src/config';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-questionaire-over-all-feedback',
  templateUrl: './questionaire-over-all-feedback.component.html',
  styleUrls: ['./questionaire-over-all-feedback.component.css']
})
export class QuestionaireOverAllFeedbackComponent implements OnInit {

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
  Modules:any;
  selected=-1;
  selectedTopicId;
  filterText='';
  topicID;
  questionnaireId:number

  actionDone: boolean = false;
  constructor(private questionaireService: QuestionaireService,private activatedRoute: ActivatedRoute
    , private router: Router,private authSerivce: AuthService, private snack: MatSnackBar) {

          
    this.activatedRoute.paramMap.pipe(map(() => window.history.state))
    .subscribe(async (data) => {
      // //console.log('BranchComponent')
       //console.log(data);
      if (data.navigationId == 1) {
        this.router.navigateByUrl("/questionaire")
      } else {
        this.questionnaireId = data.questionnaireId;
        //console.log(data['name']);

       

      }

    
  });


     }



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
   this.questionaireService.getFeedbacksByQuestionnaireTopicId(this.questionnaireId,start, limit, searchText).subscribe(
      res => {
        //console.log(res)
        this.dataLength = res['totalCount'];

        this.dataSource = res['overallFeedbacks'];
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
//console.log('selecteddddddd',this.selected)
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

  onAddedTransfer(event){

    //console.log(event);
    this.updateTable(this.start, this.pageLength, '');

  }





}

