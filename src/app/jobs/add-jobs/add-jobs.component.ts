import { Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Module, Roles } from 'src/app/Models/ModuleRoles';
import { NewIntiativesDto } from 'src/app/Models/NewIntiativesDto';
import { NewJobsDto } from 'src/app/Models/NewJobDto';
import { NewMedicalInfo } from 'src/app/Models/NewMedicalInfo';
import { AuthService } from 'src/app/service/auth.service';
import { IntiativesService } from 'src/app/service/initiatives.service';
import { JobsService } from 'src/app/service/jobs.service';
import { MedicalManagerService } from 'src/app/service/medical.service';

@Component({
  selector: 'app-add-jobs',
  templateUrl: './add-jobs.component.html',
  styleUrls: ['./add-jobs.component.css']
})
export class AddJobsComponent implements OnInit {



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
    expiryDate: new FormControl("", [Validators.required]),
    sendMailTo:new FormControl("", [Validators.required,, Validators.email]),
    active: new FormControl(""),
    sheet: new FormControl(""),
    sheet1: new FormControl(""),
  });
  //rolesCheck = [];
  fileImage: File = null; // Variable to store file 
  fileDoc: File = null; // Variable to store file 
  filePdf: File =null;

  Modules: any;
  imageUrl: any = '/assets/images/placeholder.jpg'
  // videoUrl: any = '/assets/images/placeholder.jpg'
  isuplaodImage: boolean=false
  isUploadDoc: boolean=false
  isUploadPdf: boolean=false

  selectedModelId;
  branchListOptions: any;
  actionDone: boolean = false;
  constructor(private authService: AuthService,
    private jobsService: JobsService
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


  jobDto: NewJobsDto = {
    
    title: '',
    description: '',
    sendMailTo:'',
    //mediaName:null,
    publishDate:'',
    expiryDate:'',
    active: false,
    uploadImage: false,
    uploadDoc: false,
    uploadPdf:false
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


  addNewJobs() {

    this.dataLoaded = false;
    this.serviceError = false;
    this.actionDone = false;

    var fileNameImage = this.fileImage;
    var fileNameDoc = this.fileDoc;
    var fileNamePdf = this.filePdf;
    this.jobDto.title = this.myGroup.get('title').value;
    this.jobDto.description = this.myGroup.get('description').value;
    this.jobDto.sendMailTo = this.myGroup.get('sendMailTo').value;
    this.jobDto.publishDate = this.myGroup.get('publishDate').value;
    this.jobDto.expiryDate = this.myGroup.get('expiryDate').value;
    this.jobDto.active = this.myGroup.get('active').value;
    this.jobDto.uploadImage = this.isuplaodImage;
    this.jobDto.uploadDoc = this.isUploadDoc;
    this.jobDto.uploadPdf = this.isUploadPdf;
    ////console.log('fileNameVideo', fileNameVideo)
    this.jobsService.addJobAnnouncement(this.jobDto, fileNameImage, fileNameDoc,fileNamePdf).subscribe(
      res => {
        //console.log(res)
        this.dataLoaded = true;
        this.returnedMsg = "Job Added Successfully"
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

  onChangeDoc(event) {
    //console.log('2222222222')
    if (event.target.files[0].length === 0)
      return;

    // var mimeType = event.target.files[0].type;
    // if (mimeType.match(/video\/*/) == null) {
    //   return;
    // }


    // var reader = new FileReader();
    // reader.readAsDataURL(event.target.files[0]);
    // reader.onload = (_event) => {
    //   this.videoUrl = reader.result;
    // }
    //console.log('testtttttttttt2', event.target.files[0])
    this.fileDoc = event.target.files[0];
    //console.log('testtttttttttt2', event.target.files[0])
    this.isUploadDoc = true;
  }
  onChangePdf(event) {
    //console.log('2222222222')
    if (event.target.files[0].length === 0)
      return;

    var mimeType = event.target.files[0].type;
    if (mimeType.match(/pdf\/*/) == null) {
      return;
    }


    // var reader = new FileReader();
    // reader.readAsDataURL(event.target.files[0]);
    // reader.onload = (_event) => {
    //   this.videoUrl = reader.result;
    // }
    //console.log('testtttttttttt2', event.target.files[0])
    this.filePdf = event.target.files[0];
    //console.log('testtttttttttt2', event.target.files[0])
    this.isUploadPdf = true;
  }
  resetForm() {

    this.formGroupDirective.resetForm();//this.myGroup.reset()
    
    this.imageUrl = '/assets/images/placeholder.jpg'
    //  this.myGroup.controls['rolesCheck'].setValue([]);
    //this.videoUrl = '/assets/images/placeholder.jpg'

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
