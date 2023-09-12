import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EditCorrespondenceCategory } from 'src/app/Models/EditCorrespondenceCategory';
import { CorrespondenceService } from 'src/app/service/correspondence.service';
import { config } from 'src/config';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-list-correspondence-category',
  templateUrl: './list-correspondence-category.component.html',
  styleUrls: ['./list-correspondence-category.component.css']
})
export class ListCorrespondenceCategoryComponent implements OnInit {

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('divErrorfocus') divErrorfocus: ElementRef;
  @ViewChildren("CheckBoxForm") checkBoxs: QueryList<MatCheckbox>;
  @ViewChild('divfocus') divfocus: ElementRef;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('openModalButton') openModalButton: ElementRef;
  
  pageLength = 5;
  dataLength: number;
  start = 1;
  end: number;
  filterStart = 1;
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
  Modules:any;
  selected=-1;
  selectedTopicId;
  filterText='';
 // topicID;

  englishName;
  arabicName;
  active;
  
  errorUpdateOfferCategory;
  msgUpdateOfferCategory
  updateOfferCat = true;
  
  editCorrespondenceCategory:EditCorrespondenceCategory;
  updatedId;
  
  myGroup = new FormGroup({
    englishName: new FormControl("", [Validators.required]),
    arabicName: new FormControl("", [Validators.required]),
    active: new FormControl("", ),
  });

  actionDone: boolean = false;
  constructor(private correspondenceService: CorrespondenceService, private router: Router,private authSerivce: AuthService, private snack: MatSnackBar) { 
      this.myGroup.valueChanges.subscribe(res => {
        if (this.myGroup.valid) {
          this.submittable = true;
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
    if (!this.isFilter) {
      this.filterStart = 1;
      this.start = event.pageIndex+1;
      this.end = this.pageLength;
      this.updateTable(this.start, this.end, '');
    }else{
      this.start = 1
      this.filterStart = event.pageIndex+1;
      this.end = this.filterSize;
      this.updateTable(this.filterStart, this.pageLength, this.filterText);
    }
  }

  updateTable(start, limit, searchText) {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false

    this.correspondenceService.getCorrespondenceCategories(start, limit, searchText).subscribe(
      res => {
        this.dataLength = res['totalCount'];
        this.dataSource = res['correspondenceCategorylist'];        
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
    //console.log('selecteddddddd',this.selected)
    if (keyPress === "Enter") {

      this.paginator.pageIndex = 1;
      this.filterStart = 1;
      this.isFilter = true
      this.updateTable(this.filterStart, this.pageLength, this.filterText);

    }
    if (!this.filterText) {
      this.paginator.pageIndex = 1;
      this.start = 1;
      this.isFilter = false;
      this.updateTable(this.start, this.pageLength, '');
    }
  }

  goToDivMsg() {
    setTimeout(() => {
      this.divfocus.nativeElement.scrollIntoView();
    }, 0);
  }

  goToDivErrorMsg() {
    setTimeout(() => {
      this.divErrorfocus.nativeElement.scrollIntoView();
    }, 0);
  }

  onAddedTransfer(event){
    //console.log(event);
    this.updateTable(this.start, this.pageLength, '');
  }

  getOfferCategoryDetail(data) {
    this.dataLoaded = true;
    this.actionDone = false;
    this.serviceError = false
    this.openModalButton.nativeElement.click();
    //console.log(data)
    this.myGroup.get('englishName').setValue(data.englishName);
    this.myGroup.get('arabicName').setValue(data.arabicName);
    this.updatedId=data.id;
  }

  updateCorrespondenceCategory() {
    if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.Benefit.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.edit).length==0){
        this.snack.open('You do not have access to edit ', 'OK',{
          duration: 5000
        });
    }else{
        this.updateOfferCat = false;
        this.editCorrespondenceCategory = {
          id:this.updatedId,
          englishName: this.myGroup.get('englishName').value,
          arabicName:  this.myGroup.get('arabicName').value
        }
        //console.log('before send edit object',)
        this.correspondenceService.editCorrespondenceCategory(this.editCorrespondenceCategory).subscribe(
        res => {
            //console.log(res)
            this.updateOfferCat = true;
            this.closeModal.nativeElement.click();
            //console.log('this.start = ' , this.start,' , this.pageLength, = ' ,this.pageLength,)
            this.updateTable(this.start, this.pageLength, '');
            this.snack.open('The Correspondence Category is updated', 'OK',{
              duration: 5000
            });
        }, e => {
            this.updateOfferCat = true;
            this.errorUpdateOfferCategory = true;
            if (e['status'] == 500) {
              this.msgUpdateOfferCategory = e.error['message']
            } else {
              this.msgUpdateOfferCategory = 'Service not avaliable,Try again later.'
            }
          this.goToDivErrorMsg();
      }
    )}
  }

  deleteId: any;
  selectedDeleteRow(data: any) {    
    this.actionDone = false;
    this.serviceError = false
    this.deleteId = data.id;
    this.modalMsg = "Are you sure you want to delete this Offer Category: " + data.englishName + "?"
  }

  deleteSelectedRow() {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false
    this.correspondenceService.deleteCorrespondenceCategory(this.deleteId).subscribe(
      (response) => {
        this.dataLoaded = true;
        this.updateTable(this.start, this.pageLength, '');
        this.returnedMsg = response['englishMessage']
        this.actionDone = response['actionDone'];
        this.snack.open('Action Performed Successfully', 'OK',{
          duration: 4000
        });
      }, (e) => {
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

