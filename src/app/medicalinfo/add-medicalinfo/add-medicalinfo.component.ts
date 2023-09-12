import { Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Module, Roles } from 'src/app/Models/ModuleRoles';
import { NewMedicalInfo } from 'src/app/Models/NewMedicalInfo';
import { AuthService } from 'src/app/service/auth.service';
import { MedicalManagerService } from 'src/app/service/medical.service';

@Component({
  selector: 'app-add-medicalinfo',
  templateUrl: './add-medicalinfo.component.html',
  styleUrls: ['./add-medicalinfo.component.css']
})
export class AddMedicalinfoComponent implements OnInit {


  @ViewChild('videoPlayer') videoplayer: ElementRef;

  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }


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
  //publishAppear:boolean=true;
  myGroup = new FormGroup({
    dataModel: new FormControl([], [Validators.required]),
    title: new FormControl("", [Validators.required]),
    description: new FormControl("", [Validators.required]),
    active: new FormControl(""),
    sheet: new FormControl(""),
    sheet1: new FormControl(""),
  });
  //rolesCheck = [];
  fileImage: File = null; // Variable to store file 
  fileVideo: File = null; // Variable to store file 

  Modules: any;
  imageUrl: any = '/assets/images/placeholder.jpg'
  videoUrl: any = '/assets/images/placeholder.jpg'
  isuplaodImage: boolean
  isUploadVideo: boolean

  selectedModelId;
  branchListOptions: any;
  config = {
    displayKey: "arabicName", //if objects array passed which key to be displayed defaults to description
    search: true, //true/false for the search functionlity defaults to false,
    height: '150px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: 'Select Medical Information Category', // text to be displayed when no item is selected defaults to Select,
    customComparator: () => {
    }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    limitTo: 5,// options.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search', // label thats displayed in search input,
    // searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
  }
  actionDone: boolean = false;
  constructor(private authService: AuthService,
    private medical: MedicalManagerService
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


  medicalInfoDto: NewMedicalInfo = {
    medicalInfoTopicCatId: null,
    title: '',
    description: '',
    //mediaName:null,
    isActive: false,
    uploadImage: false,
    uploadVideo: false
  };


  async ngOnInit() {
    this.actionDone = false
    this.serviceError = false
    //this.myGroup.controls['rolesCheck'].setValue(this.rolesCheck);
    this.dataLoaded = true;
    this.myGroup.get('active').setValue(false);
    try {
      //call getRoles
      this.Modules = await this.medical.getMedicalCategoryLookup().toPromise();
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
  // roleSelected(id){
  //  if(this.rolesCheck.indexOf(id)!=-1)
  //  {return true}
  //  else {
  //  return false}
  // }
  //  messageTitle;

  //newBannerDto:NewOfferDto;

  addNewMedicalInfo() {

    this.dataLoaded = false;
    this.serviceError = false;
    this.actionDone = false;

    var fileNameImage = this.fileImage;
    var fileNameVideo = this.fileVideo;
    this.medicalInfoDto.title = this.myGroup.get('title').value;
    this.medicalInfoDto.description = this.myGroup.get('description').value;
    this.medicalInfoDto.medicalInfoTopicCatId = this.selectedModelId;
    this.medicalInfoDto.isActive = this.myGroup.get('active').value;
    this.medicalInfoDto.uploadImage = this.isuplaodImage;
    this.medicalInfoDto.uploadVideo = this.isUploadVideo;
    //console.log('fileNameVideo', fileNameVideo)
    this.medical.addNewMedicalInfoService(this.medicalInfoDto, fileNameImage, fileNameVideo).subscribe(
      res => {
        //console.log(res)
        this.dataLoaded = true;
        this.returnedMsg = "Medical Added Successfully"
        this.actionDone = true;
        this.added.emit(true);
        this.resetForm();
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
    //console.log('1111111111')
    if (event.target.files[0].length === 0)
      return;

    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }


    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.imageUrl = reader.result;
    }
    this.fileImage = event.target.files[0];
    //console.log('testtttttttttt', this.fileImage)
    this.isuplaodImage = true;
  }

  onChangeVideo(event) {
    //console.log('2222222222')
    if (event.target.files[0].length === 0)
      return;

    var mimeType = event.target.files[0].type;
    if (mimeType.match(/video\/*/) == null) {
      return;
    }


    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.videoUrl = reader.result;
    }
    //console.log('testtttttttttt2', event.target.files[0])
    this.fileVideo = event.target.files[0];
    //console.log('testtttttttttt2', event.target.files[0])
    this.isUploadVideo = true;
  }

  resetForm() {

    this.formGroupDirective.resetForm();//this.myGroup.reset()
    this.myGroup.controls['dataModel'].setValue([]);
    this.imageUrl = '/assets/images/placeholder.jpg'
    //  this.myGroup.controls['rolesCheck'].setValue([]);

    //  this.rolesCheck = []
    this.checkBoxs.forEach((element) => {
      element.checked = false;
    });
    this.submittable = false;
    //  //console.log(this.rolesCheck)
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
