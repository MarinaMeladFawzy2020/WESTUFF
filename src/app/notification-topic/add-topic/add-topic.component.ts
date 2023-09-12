import { Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AddTopicRequest } from 'src/app/Models/AddTopicRequest';
import { Module, Roles } from 'src/app/Models/ModuleRoles';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationsService } from 'src/app/service/notifications.service';
@Component({
  selector: 'app-add-topic',
  templateUrl: './add-topic.component.html',
  styleUrls: ['./add-topic.component.css']
})
export class AddTopicComponent implements OnInit {



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
  errorMsg="Service not avaliable now,Try again later.";
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
  newTopic:AddTopicRequest;
  myGroup = new FormGroup({
    englishName: new FormControl("", [Validators.required]),
    arabicName: new FormControl("", [Validators.required]),
    active: new FormControl(false)

    
  });
  rolesCheck = [];
  file: File = null; // Variable to store file 
 Modules:any;

  actionDone: boolean = false;
  constructor(private authService: AuthService
    , private notificationsService: NotificationsService
    , private router: Router) {

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
    
  }


  addTopic() {

    this.dataLoaded = false;
    this.serviceError = false;
    this.actionDone = false;

    this.newTopic = {
      
      englishName: this.myGroup.get('englishName').value,
      arabicName: this.myGroup.get('arabicName').value,
      isActive:this.myGroup.get('active').value

    }

    //console.log(this.newTopic);

    this.notificationsService.addTopic(this.newTopic).subscribe(
      res => {
        //console.log(res)
        this.dataLoaded = true;
        this.returnedMsg ="Topic Added Successfully"
        this.actionDone = true;
        this.added.emit(true);
        this.resetForm();
        this.goToDivMsg();
      }, e => {
        this.dataLoaded = true;
        this.serviceError = true;
        if (e['status'] == 500||400) {
          this.errorMsg = e.error['message']
        } else {
          this.errorMsg = 'Service not avaliable now,Try again later.'
        }
        this.goToDivErrorMsg();
      }
    )
  }
 

  resetForm() {


    this.formGroupDirective.resetForm();//this.myGroup.reset()
  //   Object.keys(this.myGroup.controls).forEach(key =>{
  //     this.myGroup.controls[key].setErrors(null)
  //  });
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

}
