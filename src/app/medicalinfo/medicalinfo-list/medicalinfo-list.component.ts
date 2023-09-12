import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EditTopicRequest } from 'src/app/Models/EditTopicRequest';
import { BannersService } from 'src/app/service/banner.service';
import { AuthService } from '../../service/auth.service';
import { NotificationsService } from '../../service/notifications.service';
import { config } from 'src/config';

import { OffersService } from 'src/app/service/offer.service';
import { EditOffer } from 'src/app/Models/EditOffer';
import { ModalMedicainfoComponent } from '../modal-medicainfo/modal-medicainfo.component';
import { MedicalManagerService } from 'src/app/service/medical.service';
import { EditMedicalTopic } from 'src/app/Models/EditMedicalInfoTopic';
import { MedicalInfoDetailsById } from 'src/app/Models/MedicalInfoDetaildById';


@Component({
  selector: 'app-medicalinfo-list',
  templateUrl: './medicalinfo-list.component.html',
  styleUrls: ['./medicalinfo-list.component.css']
})
export class MedicalinfoListComponent implements OnInit {


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
  Modules: any;
  selected = [];
  selectedTopicId;
  filterText = '';
  topicID;

  englishName;
  arabicName;
  active;
  pDate;
  expDate;
  //errorUpdateRoles; msgUpdateRoles updateRoles = true;
  errorUpdateTopics;
  msgUpdateTopics
  updateTopics = true;
  editTopic: EditTopicRequest;
  updatedId;
  bannerTypeId;
  updatedImage;
  medicalDto: EditMedicalTopic;
  isUploadFile
  file: File = null; // Variable to store file 
  fileVideo: File = null;
  searchNewOffer = new FormControl(null);

  myGroup = new FormGroup({
    // englishName: new FormControl("", [Validators.required]),
    // arabicName: new FormControl("", [Validators.required]),

    // active: new FormControl("", ),

    title: new FormControl("", [Validators.required]),
    itemId: new FormControl("", [Validators.required]),
    orderNo: new FormControl("", [Validators.required]),
    expiryDate: new FormControl("", [Validators.required]),
    publishDate: new FormControl(""),
    //    messageBody: new FormControl("", [Validators.required]),

    active: new FormControl("", [Validators.required]),
    sheet: new FormControl("", [Validators.required]),

  });


  actionDone: boolean = false;
  constructor(private medical: MedicalManagerService, private offers: OffersService, public dialog: MatDialog
    , private router: Router, private authSerivce: AuthService, private snack: MatSnackBar, public datepipe: DatePipe) {


    this.myGroup.valueChanges.subscribe(res => {
      if (this.myGroup.valid) {
        this.submittable = true;
        //console.log(this.myGroup.value)
      } else {
        this.submittable = false;
      }
    });


  }


  onChange() {
    //console.log(this.searchNewOffer.value);
    this.updateTable(this.start, this.pageLength, '');

  }





  async ngOnInit(): Promise<void> {

    this.updateTable(this.start, this.pageLength, '');

    // this.Modules = await this.medical.getMedicalCategorieslookUp().toPromise();
    // //console.log( this.Modules);

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

    this.medical.getAllMedicalInformation(start, limit, searchText).subscribe(
      res => {
        //console.log(res)
        this.dataLength = res['totalCount'];

        this.dataSource = res['medicalInformationTopicDtos'];
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
    //console.log('selecteddddddd', this.selected)
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




  onAddedTransfer(event) {

    //console.log(event);
    this.updateTable(this.start, this.pageLength, '');

  }
  /////////////////// open dialog Edit Modal /////////////////////////////


  openDialog(isNew?, id?, data?): void {
    //  let data=this.question


    let dialogRef;


    let title = isNew;
    isNew = 'Edit Medical Info';
    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.Medical.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.editTopic).length == 0) {
      this.snack.open('You do not have access to edit ', 'OK', {
        duration: 5000
      });
    }
    else {
      dialogRef = this.dialog.open(ModalMedicainfoComponent, {
        width: '700px',
        data: { title: title, payload: data, new: isNew, medicalInfoId: id }
      });
    }


    //console.log('asssssasasasasasassssssssss')

    dialogRef.afterClosed().subscribe((result : MedicalInfoDetailsById) => {
      if (!result) {
        // If user press cancel
        return;
      }

      // if(isNew)
      // {
      this.dataLoaded = false;
      //console.log(result)
      this.medicalDto = {
        id: result.id,
        medicalInfoTopicCatId: result.medicalInfoTopicCategoryDto.id,
        title: result.title,
        description: result.description,
        uploadImage: result.uploadFiles,
        uploadVideo: result.uploadVideos,
        isActive: result.active
      }
      //console.log('result.uploadFiles', result.uploadFiles)
      //console.log('result.uploadVideos', result.uploadVideos)
      this.file = result.files
      this.fileVideo = result.filesVideo
      var fileNameImage = this.file
      var fileNameVideo = this.fileVideo
      //console.log('fileNameImage', fileNameImage)
      //console.log('fileNameVideo', fileNameVideo)
      //console.log('lll ', this.medicalDto)
      this.medical.editNewMedicalInfoService(this.medicalDto, fileNameImage, fileNameVideo).subscribe(

        res => {
          //console.log(res)
          this.dataLoaded = true;

          this.updateTable(this.start, this.pageLength, '');
          this.snack.open('Medical Info Updated Successfully', 'OK', {
            duration: 5000
          });
          this.dataLoaded = false;

        }, e => {
          //console.log(e)
          this.dataLoaded = true;

          this.snack.open('Error pleas try again later', 'Failed', {
            duration: 5000
          });
        }

      )

      //console.log(result)
    });
  }


}

