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
import { ModalBannerComponent } from '../modal-banner/modal-banner.component';
import { config } from 'src/config';

import { EditBanner } from 'src/app/Models/EditBanner';

@Component({
  selector: 'app-list-banner',
  templateUrl: './list-banner.component.html',
  styleUrls: ['./list-banner.component.css']
})
export class ListBannerComponent implements OnInit {



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
  selected = -1;
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
  editBanner: EditBanner;
  isUploadFile
  file: File = null; // Variable to store file 

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
  constructor(private bannerService: BannersService, private notificationsService: NotificationsService, public dialog: MatDialog
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

    this.bannerService.getAllBanner(start, limit, searchText).subscribe(
      res => {
        //console.log(res)
        this.dataLength = res['totalCount'];

        this.dataSource = res['bannersDtos'];
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
    isNew = 'Edit Banner';
    // if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.Voting.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.edit).length==0)
    //   {
    //     this.snack.open('You do not have access to edit ', 'OK',{
    //       duration: 5000
    //     });
    //   }
    //   else
    //   {
    let bannerToEdit = this.defaultData.bannersDtos.find(b => b.bannerId == id);
    //console.log("banner: " + bannerToEdit);
    dialogRef = this.dialog.open(ModalBannerComponent, {
      width: '700px',
      data: { title: title, payload: JSON.parse(JSON.stringify(bannerToEdit)), new: isNew, votingId: id }
    });
    //}

    //console.log('asssssasasasasasassssssssss')
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        // If user press cancel
        return;
      }

      // if(isNew)
      // {
      this.dataLoaded = true;
      //console.log(result)
      this.editBanner = {

        id: result.bannerId,
        title: result.title,
        publishDate: result.publishDate,
        expiryDate: result.expiryDate,
        active: result.active,
        itemId: result.itemId,
        orderNo: result.orderNo,
        bannerTypeId: result.bannerTypeId,
        uploadFiles: result.isUploadFile

      }
      //console.log('result.isUploadFile', result.isUploadFile)
      this.file = result.files
      //console.log('result.files', result.files)
      //console.log('lll ', this.editBanner)
      this.bannerService.editBanner(this.editBanner, this.file).subscribe(

        res => {
          //console.log(res)
          this.dataLoaded = true;

          this.updateTable(this.start, this.pageLength, '');
          this.snack.open('Banner Updated Successfully', 'OK', {
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
      // }
      //console.log(result)
    });
  }
}

