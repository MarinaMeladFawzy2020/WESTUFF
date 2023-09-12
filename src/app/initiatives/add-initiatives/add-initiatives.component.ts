import { Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Module, Roles } from 'src/app/Models/ModuleRoles';
import { NewIntiativesDto } from 'src/app/Models/NewIntiativesDto';
import { NewMedicalInfo } from 'src/app/Models/NewMedicalInfo';
import { AuthService } from 'src/app/service/auth.service';
import { IntiativesService } from 'src/app/service/initiatives.service';
import { MedicalManagerService } from 'src/app/service/medical.service';

@Component({
  selector: 'app-add-initiatives',
  templateUrl: './add-initiatives.component.html',
  styleUrls: ['./add-initiatives.component.css']
})
export class AddInitiativesComponent implements OnInit {


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
    title: new FormControl("", [Validators.required]),
    description: new FormControl("", [Validators.required]),
    publishDate: new FormControl("", [Validators.required]),
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
  actionDone: boolean = false;
  constructor(private authService: AuthService,
    private intiativesService: IntiativesService
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


  newIntiativesDto: NewIntiativesDto = {
    
    title: '',
    description: '',
    //mediaName:null,
    publishDate:'',
    active: false,
    uploadImage: false,
    uploadVideo: false
  };


  async ngOnInit() {
    this.actionDone = false
    this.serviceError = false
    //this.myGroup.controls['rolesCheck'].setValue(this.rolesCheck);
    this.dataLoaded = true;
    this.myGroup.get('active').setValue(false);
    // try {
    //   //call getRoles
    //   this.Modules = await this.medical.getMedicalCategoryLookup().toPromise();
    //   //console.log(this.Modules);


    //   //  this.branchListOptions = await this.branchManagerService.allBranchesByEcrmAccount().toPromise();
    //   // //console.log(this.branchListOptions)
    // } catch (e) {
    //   //console.log(e)
    //   this.serviceError = true;
    //   if (e['status'] == 500) {
    //     this.errorMsg = e.error['message']
    //   } else {
    //     this.errorMsg = 'Service not avaliable,Try again later.'
    //   }
    //   this.goToDivErrorMsg();
    // }

  }


  addNewIntiatives() {

    this.dataLoaded = false;
    this.serviceError = false;
    this.actionDone = false;

    var fileNameImage = this.fileImage;
    var fileNameVideo = this.fileVideo;
    this.newIntiativesDto.title = this.myGroup.get('title').value;
    this.newIntiativesDto.description = this.myGroup.get('description').value;
    this.newIntiativesDto.publishDate = this.myGroup.get('publishDate').value;
    this.newIntiativesDto.active = this.myGroup.get('active').value;
    this.newIntiativesDto.uploadImage = this.isuplaodImage;
    this.newIntiativesDto.uploadVideo = this.isUploadVideo;
    //console.log('fileNameVideo', fileNameVideo)
    this.intiativesService.addNewIntiatives(this.newIntiativesDto, fileNameImage, fileNameVideo).subscribe(
      res => {
        //console.log(res)
        this.dataLoaded = true;
        this.returnedMsg = "intiatives Added Successfully"
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
    
    this.imageUrl = '/assets/images/placeholder.jpg'
    //  this.myGroup.controls['rolesCheck'].setValue([]);
    this.videoUrl = '/assets/images/placeholder.jpg'

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
