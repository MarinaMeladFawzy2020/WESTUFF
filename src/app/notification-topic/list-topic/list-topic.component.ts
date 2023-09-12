import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EditTopicRequest } from 'src/app/Models/EditTopicRequest';
import { AuthService } from '../../service/auth.service';
import { NotificationsService } from '../../service/notifications.service';

@Component({
  selector: 'app-list-topic',
  templateUrl: './list-topic.component.html',
  styleUrls: ['./list-topic.component.css']
})
export class ListTopicComponent implements OnInit {


  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('divErrorfocus') divErrorfocus: ElementRef;
  @ViewChildren("CheckBoxForm") checkBoxs: QueryList<MatCheckbox>;
  @ViewChild('divfocus') divfocus: ElementRef;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('openModalButton') openModalButton: ElementRef;
  
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
  rolesList: any;
  entitySpocPersonId;
  rolesCheck = [];
  Modules:any;
  selected=-1;
  selectedTopicId;
  filterText='';
  topicID;

  englishName;
  arabicName;
  active;
  //errorUpdateRoles; msgUpdateRoles updateRoles = true;
  errorUpdateTopics;
  msgUpdateTopics
  updateTopics = true;
  editTopic:EditTopicRequest;
  updatedId;

  predefinedTopics = ["Global", "TeData Medical Network", "Te Medical Network"];

  myGroup = new FormGroup({
    englishName: new FormControl("", [Validators.required]),
    arabicName: new FormControl("", [Validators.required]),
    active: new FormControl("", ),
  });


  actionDone: boolean = false;
  constructor(private notificationsService: NotificationsService, private router: Router,private authSerivce: AuthService, private snack: MatSnackBar) { 

    this.myGroup.valueChanges.subscribe(res => {
      if (this.myGroup.valid) {
          this.submittable = true;
        //  //console.log(this.myGroup.value)
      } else {
          this.submittable = false;
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

    this.notificationsService.getAllTopics(start, limit, searchText).subscribe(
      res => {
        //console.log(res)
        this.dataLength = res['totalCount'];

        this.dataSource = res['list'];
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
    ////console.log('applyFilter ' + filterValue.trim().toLowerCase())
    this.filterText = filterValue.trim().toLowerCase();
    ////console.log('selecteddddddd',this.selected)
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
    ////console.log(event);
    this.updateTable(this.start, this.pageLength, '');

  }

  getTopicDetail(data) {
    this.dataLoaded = true;
    this.actionDone = false;
    this.serviceError = false
    // this.showModalBox = false;
    this.openModalButton.nativeElement.click();
    ////console.log(data)
//     this.editTopic = {
// id:data.id,
// englishName: data.englishName,
// arabicName:  data.arabicName,
// isActive: data.active
//     }
    // this.englishName = data.englishName;
    // this.arabicName = data.arabicName;
    // this.active = data.active;
    //call serive 
    this.myGroup.get('englishName').setValue(data.englishName);
    this.myGroup.get('arabicName').setValue(data.arabicName);
    this.myGroup.get('active').setValue(data.active);
    this.updatedId=data.id;
    //console.log('ttttttttt',data.id)
  }
  updateTopic() {
    // //console.log(this.branchName + ' ' + this.branchId)
    this.updateTopics = false;
    this.editTopic = {
      id:this.updatedId,
      englishName: this.myGroup.get('englishName').value,
      arabicName:  this.myGroup.get('arabicName').value,
      isActive: this.myGroup.get('active').value
    }
    ////console.log('before send edit object')
    ////console.log(this.editTopic)
    this.notificationsService.editTopic(this.editTopic).subscribe(
      res => {
      //  //console.log(res)
        this.updateTopics = true;
        this.closeModal.nativeElement.click();
        this.updateTable(this.start, this.pageLength, '');
        this.snack.open('The topic is updated', 'OK',{
          duration: 5000
        });
      }, e => {
        this.updateTopics = true;

        this.errorUpdateTopics = true;
        if (e['status'] == 500) {
          this.msgUpdateTopics = e.error['message']
        } else {
          this.msgUpdateTopics = 'Service not avaliable,Try again later.'
        }
        this.goToDivErrorMsg();
      }
    )
  }

  checkPredefinedTopics(englishName): boolean {
    return this.predefinedTopics.toString().toLowerCase().indexOf(englishName.toLowerCase()) > -1
  }

}

