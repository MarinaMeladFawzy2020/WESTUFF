import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ComplaintsService } from 'src/app/service/complaints.service';
import { ComplaintEditComponent } from '../complaint-edit/complaint-edit.component';

@Component({
  selector: 'app-complaint-feedback',
  templateUrl: './complaint-feedback.component.html',
  styleUrls: ['./complaint-feedback.component.css']
})
export class ComplaintFeedbackComponent implements OnInit {

  [x:string]:any;
  pageLength = 5;
  dataLength: number;
  start = 0;
  end: number;
  filterStart = 0;
  filterSize = 5;
  isFilter = false;
  filterArray;
  defaultData: any;


  dataLoaded: boolean = false;
  submitLoaded :boolean = false;
  statusLoaded :boolean = false;
  serviceError : boolean = false;
  actionDone: boolean = false;

  errorMsg = '';
  returnedMsg ='';
  modalMsg = '';
  dataSource :any =[];
  deleteId: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('divfocus') divfocus: ElementRef;
  @ViewChild('divErrorfocus') divErrorfocus: ElementRef;
  @Input('inputID') inputID :ComplaintEditComponent
  constructor( private dataApi:ComplaintsService , private authSerivce: AuthService, public dialog: MatDialog, private snack: MatSnackBar, private activatedRoute: ActivatedRoute, private route: Router) { }

  ngOnInit(): void {
    this.feedbackForm = new FormGroup({
      message: new FormControl('',[Validators.required])
    });

    this.changeStatusForm = new FormGroup({
      status: new FormControl('',[Validators.required])
    });


    this.updateTable(this.start, this.pageLength, '');

  }

  updateTable(start, limit, searchText) {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false;
    this.dataApi.getComplaintFeedbackList(this.inputID).subscribe(
      (res:any) => {
        console.log(res)
        this.dataLength = res.totalCount;
        this.dataSource = res;
        this.defaultData = res;
        this.dataLoaded = true;
        this.filterArray = new MatTableDataSource(this.defaultData);
        this.filterArray1 = res.body;
      }, e => {
        console.log(e)
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
    if (!this.isFilter) {
      this.filterStart = 0;
      this.start = event.pageIndex;
      this.end = this.pageLength;
      this.updateTable(this.start, this.end, '');
    } else {
      this.start = 0
      this.filterStart = event.pageIndex;
      this.end = this.filterSize;
      this.updateTable(this.filterStart, this.pageLength, this.filterText);
    }
  }



  applyFilter(event) {
    this.actionDone = false
    this.serviceError = false
    this.serviceError = false
    var filterValue = event.target.value
    var keyPress = event.key
    this.filterText = filterValue.trim().toLowerCase();

    if (keyPress === "Enter") {
      this.paginator.pageIndex = 0;
      this.filterStart = 0;
      this.isFilter = true;
       this.start = 0

     this.filteredArray =  this.filterArray1.filter((obj) => obj.englishName.toLowerCase().includes(this.filterText) || obj.arabicName.includes(this.filterText));
      console.log(this.filteredArray)
      this.dataSource = this.filteredArray;
      // this.updateTable(this.filterStart, this.pageLength, this.filterText);
      this.dataLength = this.filteredArray.length;

    }
    if (!this.filterText) {
      this.paginator.pageIndex = 0;
      this.start = 0;
      this.isFilter = false;
      this.dataSource = this.filterArray1
     // this.updateTable(this.start, this.pageLength, '');
    }
  }

  addNewfeedbackSubmit(){
    this.submitLoaded = true;
    console.log(this.feedbackForm.value);
    this.dataApi.submitComplaintFeedback( this.inputID, this.feedbackForm.value).subscribe(
      (response:any) => {
        console.log(response);
        this.submitLoaded = false;
        this.feedbackForm.reset();
        this.returnedMsg = response['englishMessage']
        this.actionDone = true;
        this.goToDivMsg();
        this.snack.open(this.returnedMsg, 'OK', {
          duration: 5000
        });
        this.updateTable(this.filterStart, this.pageLength, this.filterText);
      }, e => {
        console.log(e)
        this.submitLoaded = false;
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

  changeStatusSubmit(){
    this.statusLoaded = true;
    console.log(this.changeStatusForm.value);
    this.dataApi.updateComplaintStatus( this.inputID, this.changeStatusForm.value.status).subscribe(
      (response:any) => {
        console.log(response);
        this.statusLoaded = false;
        this.changeStatusForm.reset();
        this.returnedMsg = response['englishMessage']
        this.actionDone = true;
        this.goToDivMsg();
        this.snack.open(this.returnedMsg, 'OK', {
          duration: 2000
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }, e => {
        console.log(e)
        this.statusLoaded = false;
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

  goToDivErrorMsg() {
    setTimeout(() => {
       this.divErrorfocus.nativeElement.scrollIntoView();
       this.automaticallyHidden();
    }, 0);
  }

  goToDivMsg() {
    setTimeout(() => {
      this.divfocus.nativeElement.scrollIntoView();
      this.automaticallyHidden();
    },0);
  }

  automaticallyHidden(){
    setTimeout(() => {
      this.actionDone = false;
      this.serviceError = false;
    }, 5000);
  }


  goBack() {
    window.history.back();
  }

}
