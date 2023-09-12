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
import { config } from 'src/config';

import { OffersService } from 'src/app/service/offer.service';
import { ModalOfferComponent } from '../modal-offer/modal-offer.component';
import { EditOffer } from 'src/app/Models/EditOffer';

@Component({
  selector: 'app-list-offer',
  templateUrl: './list-offer.component.html',
  styleUrls: ['./list-offer.component.css']
})
export class ListOfferComponent implements OnInit {




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
  editOffer: EditOffer;
  isUploadFile
  file: File = null; // Variable to store file 
  searchNewOffer = new FormControl(null);
  deleteId: any;

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
  constructor(private bannerService: BannersService, private offers: OffersService, public dialog: MatDialog
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
    this.updateTable(this.start, this.pageLength, '', this.searchNewOffer.value, this.selected);

  }

  selectionChanged(event) {
    //console.log('drop down ', event + "size" + event.value.length)
    this.selected = []

    for (var n = 0; n < event.value.length; n++) {
      this.selected.push(event.value[n].id)
    }
    //this.selected.push(event.value.id);
    //console.log(this.selected)
    //console.log(this.filterText)
    if (this.filterText) {
      this.updateTable(this.start, this.pageLength, '', this.searchNewOffer.value, this.selected);
    } else
      this.updateTable(this.start, this.pageLength, this.filterText, this.searchNewOffer.value, this.selected);
  }

  config = {
    displayKey: "arabicName", //if objects array passed which key to be displayed defaults to description
    search: true, //true/false for the search functionlity defaults to false,
    height: '150px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: 'Select Offer Category', // text to be displayed when no item is selected defaults to Select,
    customComparator: () => {
    }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    limitTo: 5,// options.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search', // label thats displayed in search input,
    // searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: true // clears search criteria when an option is selected if set to true, default is false
  }

  async ngOnInit(): Promise<void> {

    this.updateTable(this.start, this.pageLength, '', this.searchNewOffer.value, []);

    this.Modules = await this.offers.getAllOfferCategoryLookup().toPromise();
    //console.log(this.Modules);

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
      this.updateTable(this.start, this.end, '', this.searchNewOffer.value, this.selected);
    } else {
      this.start = 0

      this.filterStart = event.pageIndex;
      this.end = this.filterSize;
      // //console.log('start ' + this.filterStart + ' limit ' + this.filterSize)
      this.updateTable(this.filterStart, this.pageLength, this.filterText, this.searchNewOffer.value, this.selected);
    }
  }
  updateTable(start, limit, searchText, newOffer, offerCategoryId) {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false

    this.offers.getAllOffers(start, limit, searchText, newOffer, offerCategoryId).subscribe(
      res => {
        //console.log(res)
        this.dataLength = res['totalCount'];

        this.dataSource = res['offerEditDto'];
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
      this.updateTable(this.filterStart, this.pageLength, this.filterText, this.searchNewOffer.value, this.selected);

    }
    if (!this.filterText) {

      // //console.log('no filter')
      this.paginator.pageIndex = 0;
      this.start = 0;
      this.isFilter = false;
      this.updateTable(this.start, this.pageLength, '', this.searchNewOffer.value, this.selected);
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
    this.updateTable(this.start, this.pageLength, '', false, []);

  }
  /////////////////// open dialog Edit Modal /////////////////////////////


  openDialog(isNew?, id?, data?): void {
    //  let data=this.question


    let dialogRef;


    let title = isNew;
    isNew = 'Edit Offer';
    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.Benefit.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.edit).length == 0) {
      this.snack.open('You do not have access to edit ', 'OK', {
        duration: 5000
      });
    }
    else {
      dialogRef = this.dialog.open(ModalOfferComponent, {
        width: '700px',
        data: { title: title, payload: data, new: isNew, offerId: id }
      });
    }


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
      this.editOffer = {
        id: result.id,
        offerCategoryId: result.offerCategoryId,
        title: result.title,
        partnerName: result.partnerName,
        startDate: result.startDate,
        endDate: result.endDate,
        description: result.description,
        mediaName: result.mediaName,
        // isNewOffer:result.newOffer,
        // isNotified:result.notified,
        uploadFiles: result.isUploadFile

      }
      //console.log('result.isUploadFile', result.isUploadFile)
      this.file = result.files
      //console.log('result.files', result.files)
      //console.log('lll ', this.editOffer)
      this.offers.editOffer(this.editOffer, this.file).subscribe(

        res => {
          //console.log(res)
          this.dataLoaded = true;
          this.updateTable(this.start, this.pageLength, '', this.searchNewOffer.value, []);

          //      this.updateTable(this.start, this.pageLength, '',false,[]);
          this.snack.open('Offer Updated Successfully', 'OK', {
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
     
      // console.log(result)
    });
    // debugger;
  }



  selectedDeleteRow(data: any) {
    this.actionDone = false;
    this.serviceError = false;
    this.deleteId = data.id;
    this.modalMsg = "Are you sure you want to delete this Offer : " + data.title + "?"
    //console.log('this.delete id ' + this.deleteId);

  }

  deleteSelectedRow() {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false


    this.offers.deleteOfferById(this.deleteId).subscribe(
      (response) => {
        this.dataLoaded = true;
        //after delete get new data from database 
        this.updateTable(this.start, this.pageLength, '', this.searchNewOffer.value, this.selected);
        this.returnedMsg = response['englishMessage']
        this.actionDone = response['actionDone'];
        this.snack.open('Action Performed Successfully', 'OK', {
          duration: 4000
        });
        //this.goToDivMsg();
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


}

