import { Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Module, Roles } from 'src/app/Models/ModuleRoles';
import { NewBannerDto } from 'src/app/Models/NewBanner';
import { AuthService } from 'src/app/service/auth.service';
import { BannersService } from 'src/app/service/banner.service';
import { NotificationsService } from 'src/app/service/notifications.service';

@Component({
  selector: 'app-add-banner',
  templateUrl: './add-banner.component.html',
  styleUrls: ['./add-banner.component.css']
})
export class AddBannerComponent implements OnInit {


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
  filteredmodule: Module;
  rolesList: Roles[];
  entitySpocPersonId;
  //newUser:AddUserRequest;
  publishAppear: boolean = true;
  myGroup = new FormGroup({
    dataModel: new FormControl([], [Validators.required]),
    title: new FormControl("", [Validators.required]),
    expiryDate: new FormControl("", [Validators.required]),
    publishDate: new FormControl(""),
    //    messageBody: new FormControl("", [Validators.required]),
    // itemId: new FormControl("", [Validators.required]),
    orderId: new FormControl("", [Validators.required]),
    active: new FormControl("", [Validators.required]),
    //    sendNow: new FormControl(true)
    sheet: new FormControl("", [Validators.required]),
  });
  rolesCheck = [];
  file: File = null; // Variable to store file 
  Modules: any;
  bannerUrl: any = '/assets/images/placeholder.jpg'
  selectedModelId;
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
    placeholder: 'Select Banner Type', // text to be displayed when no item is selected defaults to Select,
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
    , private notifications: NotificationsService,
    private banners: BannersService
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


  bannerDto: NewBannerDto = {
    bannerTypeId: null,
    title: '',
    expiryDate: null,
    publishDate: null,
    active: false,
    itemId: null,
    orderNo: null,
  };


  async ngOnInit() {
    this.actionDone = false
    this.serviceError = false
    //this.myGroup.controls['rolesCheck'].setValue(this.rolesCheck);
    this.dataLoaded = true;
    //this.myGroup.get('active').setValue(false);
    try {
      //call getRoles
      this.Modules = await this.banners.getAllBannerTypeLookup().toPromise();
      //console.log(this.Modules);


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

  selectionChanged(event) {
    //console.log('drop down ', this.myGroup.controls['dataModel'].value['id'])
    this.selectedModelId = this.myGroup.controls['dataModel'].value['id'];
    //console.log(this.selectedModelId)

  }
  roleSelected(id) {
    if (this.rolesCheck.indexOf(id) != -1) { return true }
    else {
      return false
    }
  }
  //  messageTitle;

  newBannerDto: NewBannerDto;

  addNewBanner() {

    this.dataLoaded = false;
    this.serviceError = false;
    this.actionDone = false;


    // var id=this.selectedModelId;
    // var title= this.myGroup.get('title').value;
    // var messageBody = this.myGroup.get('messageBody').value;
    // var expiryDate = this.myGroup.get('expiryDate').value;
    var fileName = this.file;
    // var publishDate=this.myGroup.get('publishDate').value;
    //      var sendNow=this.myGroup.get('sendNow').value;
    //var sendNow=true;
    // //console.log(id,messageBody,messageTitle,expiryDate,fileName)
    // //console.log(fileName)
    // this.newBannerDto{}
    this.bannerDto.title = this.myGroup.get('title').value;
    this.bannerDto.bannerTypeId = this.selectedModelId;
    this.bannerDto.publishDate = this.myGroup.get('publishDate').value;
    this.bannerDto.expiryDate = this.myGroup.get('expiryDate').value;
    //this.bannerDto.itemId=this.myGroup.get('itemId').value;
    this.bannerDto.orderNo = this.myGroup.get('orderId').value;
    this.bannerDto.active = this.myGroup.get('active').value;


    this.banners.addNewBanner(this.bannerDto, fileName).subscribe(
      res => {
        //console.log(res)
        this.dataLoaded = true;
        this.returnedMsg = "Banner Added Successfully"
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

    if (event.target.files[0].length === 0)
      return;

    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }


    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.bannerUrl = reader.result;
    }
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

  sendNow() {


    //console.log("changeeed");
    if (this.myGroup.get('sendNow').value == true) {
      this.publishAppear = false;
      this.myGroup.get('publishDate').setValue(null);
    } else {

      this.publishAppear = true;
    }

  }
}
