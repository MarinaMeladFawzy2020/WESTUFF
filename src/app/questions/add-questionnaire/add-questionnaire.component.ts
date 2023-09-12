import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AddQuestionaireRequest } from 'src/app/Models/AddQuestionaireRequest';
import { AddUserRequest } from 'src/app/Models/AddUserRequest';
import { Module, Roles } from 'src/app/Models/ModuleRoles';
import { AuthService } from 'src/app/service/auth.service';
import { NotificationsService } from 'src/app/service/notifications.service';
import { QuestionaireService } from 'src/app/service/questionaire.service';

@Component({
  selector: 'app-add-questionnaire',
  templateUrl: './add-questionnaire.component.html',
  styleUrls: ['./add-questionnaire.component.css']
})
export class AddQuestionsComponent implements OnInit {



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
  newQuestionaire:AddQuestionaireRequest;
  myGroup = new FormGroup({
    title: new FormControl("", [Validators.required]),
    description: new FormControl("", [Validators.required]),
    publishDate: new FormControl("", [Validators.required]),
    expiryDate: new FormControl("", [Validators.required]),
    active: new FormControl(false ),
    overallFeedback : new FormControl(false )


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
    displayKey: "name", //if objects array passed which key to be displayed defaults to description
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
    , private questionaireService: QuestionaireService
    , private router: Router,public datepipe: DatePipe,private fb: FormBuilder) {

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


  addQuestionaire() {

    this.dataLoaded = false;
    this.serviceError = false;
    this.actionDone = false;

    this.newQuestionaire = {
      
      title: this.myGroup.get('title').value,
      description: this.myGroup.get('description').value,
      publishDate: this.myGroup.get('publishDate').value,
      expiryDate:this.myGroup.get('expiryDate').value,
      active:this.myGroup.get('active').value,
      overallFeedback:this.myGroup.get('overallFeedback').value
    }

    

    //console.log(this.newQuestionaire);

    this.questionaireService.addQuestionaire(this.newQuestionaire).subscribe(
      res => {
        //console.log(res)
        this.dataLoaded = true;
        this.returnedMsg ="Questionaire Added Successfully"
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

    this.formGroupDirective.resetForm();   // this.myGroup.reset()
  //   this.myGroup.setAsyncValidators()
  //   Object.keys(this.myGroup.controls).forEach(key =>{
  //     this.myGroup.controls[key].setErrors(null)
  //  });
//    this.myGroup.get('title').setValue(''),
//    this.myGroup.get('description').setValue(''),
//    this.myGroup.get('publishDate').setValue(''),
// this.myGroup.get('expiryDate').setValue(''),
//   this.myGroup.get('active').setValue(''),
//   this.myGroup.get('overallFeedback').setValue('')

// this.myGroup.clearValidators();
//this.myGroup.updateValueAndValidity();
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
