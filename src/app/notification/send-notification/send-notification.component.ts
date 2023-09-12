import { Component, OnInit, ViewChild, ViewChildren, QueryList, ElementRef, Output, EventEmitter } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCheckbox } from '@angular/material/checkbox';
import { Module, Roles } from 'src/app/Models/ModuleRoles';
import { AddUserRequest } from 'src/app/Models/AddUserRequest';
import { AuthService } from 'src/app/service/auth.service';
import { BranchManagerService } from 'src/app/service/branch-manager.service';
import { NotificationsService } from 'src/app/service/notifications.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-send-notification',
  templateUrl: './send-notification.component.html',
  styleUrls: ['./send-notification.component.css']
})
export class SendNotificationComponent implements OnInit {


  @ViewChild('paginator') paginator: MatPaginator;
  // @ViewChild('CheckBoxForm') checkBoxs: MatCheckbox;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @ViewChildren("CheckBoxForm") checkBoxs: QueryList<MatCheckbox>;
  @ViewChild('divfocus') divfocus: ElementRef;
  @ViewChild('divErrorfocus') divErrorfocus: ElementRef;
  @Output() added = new EventEmitter<boolean>();
  pageLength = 5;
  dataLength: number;
  start = 0;
  end: number;
  filterStart = 0;
  filterSize = 5;
  isFilter = false;

  pageEvent: PageEvent;
  filterArray;
  errorMsg='Service not avaliable now,Try again later.';
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
  filteredmodule:Module;
  rolesList: Roles[];
  entitySpocPersonId;
  newUser:AddUserRequest;
  publishAppear:boolean=true;
  myGroup = new FormGroup({
    dataModel: new FormControl([], [Validators.required]),
    messageTitle: new FormControl("", [Validators.required]),
    expiryDate: new FormControl("", [Validators.required]),
    publishDate: new FormControl(""),
    messageBody: new FormControl("", [Validators.required]),
    sendNow: new FormControl(true)
  });
  rolesCheck = [];
  file: File = null; // Variable to store file 
 Modules:any;

 selectedTopicId;
//=[
//   {
//     id:1,
//     moduleName:'Voting',
//     roles:[{id:1,roleName:'Add'},{id:2,roleName:'Edit'}]
//   },
//   {
//     id:2,
//     moduleName:'Events',
//     roles:[{id:3,roleName:'Add'},{id:4,roleName:'Delete'}]
//   },
//   {
//     id:3,
//     moduleName:'Medical',
//     roles:[{id:5,roleName:'Add'},{id:6,roleName:'Approve'}]
//   }
// ]
//ModuleNames=this.Modules.map(item=>item.moduleName);
  branchListOptions: any;
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
  actionDone: boolean = false;
  constructor(private authService: AuthService
    , private notificationsService: NotificationsService
    ,private notifications:NotificationsService
    , private router: Router,public datepipe: DatePipe) {

    //this.ecrmAccountNo = authService.currentUser.ECRMAssociatedAccountNo
    // this.entitySpocPersonId = authService.currentUser.EntitySpocPersonId
    this.myGroup.valueChanges.subscribe(res => {
      if (this.myGroup.valid) {
        this.submittable = true;
        //console.log(this.myGroup.value)
      } else {
        this.submittable = false;
      }
    });
  }

  async ngOnInit() {
    this.actionDone = false
    this.serviceError = false
    //this.myGroup.controls['rolesCheck'].setValue(this.rolesCheck);
    this.dataLoaded=true;
    //this.myGroup.get('active').setValue(false);
    try {
      //call getRoles
      this.Modules = await this.notifications.getAllTopic().toPromise();
      //console.log( this.Modules);
      

        //  this.branchListOptions = await this.branchManagerService.allBranchesByEcrmAccount().toPromise();
       // //console.log(this.branchListOptions)
    } catch (e) {
      //console.log(e)
      this.serviceError = true;
      if (e['status'] == 500) {
        this.errorMsg = e.error['message']
      } else {
        this.errorMsg = 'Service not avaliable,Try again later.'
      }
      this.goToDivErrorMsg();
    }

  }

  selectionChanged(event){
    //console.log('drop down ',this.myGroup.controls['dataModel'].value['id'])
    this.selectedTopicId=this.myGroup.controls['dataModel'].value['id'];
    //console.log(this.selectedTopicId)

  }
  roleSelected(id){
   if(this.rolesCheck.indexOf(id)!=-1)
   {return true}
   else {
   return false}
  }
//  messageTitle;

  sendNotification() {

    this.dataLoaded = false;
    this.serviceError = false;
    this.actionDone = false;

      var id=this.selectedTopicId;
      var messageTitle= this.myGroup.get('messageTitle').value;
      var messageBody = this.myGroup.get('messageBody').value;
      var expiryDate = this.datepipe.transform(this.myGroup.get('expiryDate').value, 'yyyy-MM-ddTHH:mm');
     //console.log(expiryDate)
      //console.log('expiry ',new Date(expiryDate))
      var fileName = this.file;
      var publishDate=this.myGroup.get('publishDate').value;
      var sendNow=this.myGroup.get('sendNow').value;
      //var sendNow=true;
      // //console.log(id,messageBody,messageTitle,expiryDate,fileName)
      // //console.log(fileName)

      
    // new Date(expiryDate).toISOString()
    this.notificationsService.sendNotification(messageTitle,messageBody,id,expiryDate,publishDate,fileName,sendNow).subscribe(
      res => {
        //console.log(res)
        this.dataLoaded = true;
        this.returnedMsg ="Notification Added Successfully"
        this.actionDone = true;
        this.added.emit(true);
        //this.resetForm();
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

 
  onChange(event) { 
    this.file = event.target.files[0]; 
}
 

  resetForm() {

    // this.myGroup = new FormGroup({
    //   name: new FormControl("", [Validators.required]),
    //   username: new FormControl("", [Validators.required]),
    //   email: new FormControl("", [Validators.required, Validators.email]),
    //   mobilenumber: new FormControl("", [Validators.required, , Validators.pattern(new RegExp(/^(01)(0|1|2|5)[0-9]{8}/))]),
    //   dataModel: new FormControl([], [Validators.required]),
    //   rolesCheck: new FormControl([]),
    // });

    this.formGroupDirective.resetForm();//this.myGroup.reset()
    this.myGroup.controls['dataModel'].setValue([]);
    this.myGroup.controls['rolesCheck'].setValue([]);

    this.rolesCheck = []
    this.checkBoxs.forEach((element) => {
      element.checked = false;
    });
    this.submittable = false;
    //console.log(this.rolesCheck)
  }

  goToDivMsg() {
    setTimeout(() => {
      // //console.log(this.divfocus.nativeElement)
      this.divfocus.nativeElement.scrollIntoView();

    }, 0);
  }

  goToDivErrorMsg() {
    setTimeout(() => {
      // //console.log(this.divfocus.nativeElement)
      this.divErrorfocus.nativeElement.scrollIntoView();

    }, 0);
  }

  sendNow(){


//console.log("changeeed");
if(this.myGroup.get('sendNow').value==true)
{
this.publishAppear=false;
this.myGroup.get('publishDate').setValue(null);
}else{

  this.publishAppear=true;
}

  }
}
