import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EditNotificationRequest } from 'src/app/Models/EditNotificationRequest';
import { NotificationsService } from 'src/app/service/notifications.service';
import { config } from 'src/config';
import { AuthService } from '../../service/auth.service';


@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {

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
  //ecrmAccountNo;
  rolesList: any;
  entitySpocPersonId;
  myGroup = new FormGroup({
    messageTitle: new FormControl("", [Validators.required]),
    messageBody: new FormControl("", [Validators.required]),
 
  });
  errorUpdateNotification;
  msgUpdateNotification
  updateTopics = true;
  editNotification:EditNotificationRequest;
  updatedId;

  rolesCheck = [];
  Modules:any;
  selected=-1;
  selectedTopicId;
  filterText='';
  topicID;

  deleteChecked: boolean = false;
  updateChecked: boolean = false;



  // delete checked from delete popup
  changeValue_delete(event) {
    //console.log('deleteChecked = ' , event.checked)
    this.deleteChecked = event.checked;
  }

   // updated checked from update popup
   changeValue_update(event) {
    //console.log('updateChecked = ' , event.checked)
    this.updateChecked = event.checked;
  }


  selectionChanged(event){
     //console.log('drop down ',event.value.id)
     this.selected=event.value.id;
     //console.log(this.selected)
     //console.log(this.filterText)
      if(this.filterText)
      {
     this.updateTable(this.start, this.pageLength,'',this.selected);
       }else
       this.updateTable(this.start, this.pageLength, this.filterText,this.selected);
  }

  config = {
    displayKey: "arabicName", //if objects array passed which key to be displayed defaults to description
    search: true, //true/false for the search functionlity defaults to false,
    height: '150px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: 'Select Module Topic', // text to be displayed when no item is selected defaults to Select,
    customComparator: () => {
    }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    limitTo: 5,// options.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search', // label thats displayed in search input,
    // searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
  }

  edit:boolean=false;
  delete:boolean=false;
  actionDone: boolean = false;
  constructor(private notificationService: NotificationsService
    , private router: Router,private authSerivce: AuthService, private snack: MatSnackBar) {
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

      //console.log(this.edit)
      if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.Notification.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.edit).length==0)
      {  this.edit=false;}
        else
        {
        this.edit=true
        }
    //console.log(this.edit)
    if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.Notification.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.delete).length==0)
    {  this.delete=false;}
      else
      {
      this.delete=true
      }
    }

  async ngOnInit(): Promise<void> {

    this.updateTable(this.start, this.pageLength, '',-1);

    this.Modules = await this.notificationService.getAllTopic().toPromise();
    //console.log( this.Modules);
    
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
      this.updateTable(this.start, this.end, '',-1);
    } else {
      this.start = 0

      this.filterStart = event.pageIndex;
      this.end = this.filterSize;
      // //console.log('start ' + this.filterStart + ' limit ' + this.filterSize)
      this.updateTable(this.filterStart, this.pageLength, this.filterText,-1);
    }
  }
  updateTable(start, limit, searchText,topicId) {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false
// change service to call notification List
    //console.log('getBranchManagersList')
    //call service getBranchManagersList
    this.notificationService.getAllNotifications(start, limit, searchText,topicId).subscribe(
      res => {
        //console.log(res)
        this.dataLength = res['totalCount'];

        this.dataSource = res['notificationsResponseDto'];
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
      this.updateTable(this.filterStart, this.pageLength, this.filterText,this.selected);

    }
    if (!this.filterText) {

      // //console.log('no filter')
      this.paginator.pageIndex = 0;
      this.start = 0;
      this.isFilter = false;
      this.updateTable(this.start, this.pageLength, '',-1);
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
    this.updateTable(this.start, this.pageLength, '',-1);

  }

  getNotificationDetail(data) {
    // if (this.authSerivce.getUserRoles().filter(item => config.authRoles.Notification.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.edit).length == 0) {
    //   this.snack.open('You do not have access to edit ', 'OK', {
    //     duration: 5000
    //   });
    // }
    // else{
    this.dataLoaded = true;
    this.actionDone = false;
    this.serviceError = false
    // this.showModalBox = false;
  //  this.openModalButton.nativeElement.click();
    //console.log(data)
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
    this.myGroup.get('messageTitle').setValue(data.messageTitle);
    this.myGroup.get('messageBody').setValue(data.messageBody);

    this.updatedId=data.id;
    //console.log('ttttttttt',data.id)
  //  this.dataLoaded = false;
  }
  
  updateNotification() {
    this.updateTopics = false;
    this.editNotification = {
      id:this.updatedId,
      messageTitle: this.myGroup.get('messageTitle').value,
      messageBody:  this.myGroup.get('messageBody').value,
    }
    //console.log('before send edit object',)
    this.notificationService.editNotification(this.editNotification).subscribe(
      res => {
        //console.log(res)
        this.updateTopics = true;
        this.closeModal.nativeElement.click();
        this.updateTable(this.start, this.pageLength, '',-1);
        this.snack.open('The notification is updated', 'OK',{
          duration: 5000
        });
      }, e => {
        this.updateTopics = true;
        this.errorUpdateNotification = true;
        if (e['status'] == 500) {
          this.msgUpdateNotification = e.error['message']
        } else {
          this.msgUpdateNotification = 'Service not avaliable,Try again later.'
        }
        this.goToDivErrorMsg();
      }
    )
  }

  renotifyNotification() {
    this.dataLoaded = false;
    this.updateTopics = false;
    this.editNotification = {
      id:this.updatedId,
      messageTitle: this.myGroup.get('messageTitle').value,
      messageBody:  this.myGroup.get('messageBody').value,
    }
    //console.log('before send edit object',)
    this.notificationService.renotifyNotificationPerTopic(this.editNotification).subscribe(
      res => {
        //console.log(res)
        this.updateTopics = true;
        this.closeModal.nativeElement.click();
        this.updateTable(this.start, this.pageLength, '',-1);
        this.dataLoaded = true;
        this.snack.open('The notification is Re-Notified', 'OK',{
          duration: 5000
        });
      }, e => {
        this.updateTopics = true;
        this.errorUpdateNotification = true;
        if (e['status'] == 500) {
          this.msgUpdateNotification = e.error['message']
        } else {
          this.msgUpdateNotification = 'Service not avaliable,Try again later.'
        }
        this.goToDivErrorMsg();
        this.dataLoaded = true;
      }
    )
  }

  deleteId: any;
  selectedDeleteRow(data: any) {
    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.Notification.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.delete).length == 0) {
      this.snack.open('You do not have access to edit ', 'OK', {
        duration: 5000
      });
    }
    else{
    this.actionDone = false;
    this.serviceError = false

    this.deleteId = data.id;
    this.modalMsg = "Are you sure you want to delete this Notification : " + data.messageTitle + "?"
    //console.log('this.delete id ' + this.deleteId);
  }
  }

  deleteSelectedRow() {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false
    this.notificationService.deleteNotification(this.deleteId).subscribe(
      (response) => {
        this.dataLoaded = true;
        //after delete get new data from database 
        this.updateTable(this.start, this.pageLength, '',-1);
        this.returnedMsg = response['englishMessage']
        this.actionDone = response['actionDone'];
        this.goToDivMsg();
        this.snack.open('The notification is deleted', 'OK',{
          duration: 5000
        });
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

  recallSelectedRow() {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false

    this.notificationService.recallPerTopicNotification(this.deleteId).subscribe(
      (response) => {
        this.dataLoaded = true;
        //after delete get new data from database 
        this.updateTable(this.start, this.pageLength, '',-1);
        this.returnedMsg = response['englishMessage']
        this.actionDone = response['actionDone'];
        this.goToDivMsg();
        this.snack.open('The notification is recalled', 'OK',{
          duration: 5000
        });
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

  // ckeck delete from db only or (db && firebase)
  applyDelete(){
    //console.log('from applyDelete = ' + this.deleteChecked)
    if(this.deleteChecked == true){
      //console.log('from true')
      this.recallSelectedRow();
    }else{
      //console.log('from false')
      this.deleteSelectedRow();
    }
  }

  // check update db only or (db & firebase)
  applyUpdate(){
    //console.log('from applyUpdate = ' + this.updateChecked)
    if(this.updateChecked == true){
      //console.log('from true')
      this.renotifyNotification();
    }else{
      //console.log('from false')
      this.updateNotification();
    }
  }

}
