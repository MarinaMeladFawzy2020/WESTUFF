import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { config } from 'process';
import { EditNewsCategory } from 'src/app/Models/EditNewsCategory';
import { AuthService } from 'src/app/service/auth.service';
import { NewsCategoryService } from 'src/app/service/news-category.service';

@Component({
  selector: 'app-list-news-category',
  templateUrl: './list-news-category.component.html',
  styleUrls: ['./list-news-category.component.css']
})
export class ListNewsCategoryComponent implements OnInit {

 
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
  Modules:any;
  selected=1;
  selectedTopicId;
  filterText='';
 // topicID;

  englishName;
  arabicName;
  active;
  
  errorUpdateNewsCategory;
  msgUpdateNewsCategory;
  updateNewsCat = true;
  
  editNewsCategory:EditNewsCategory;
  updatedId;
  
  myGroup = new FormGroup({
    englishName: new FormControl("", [Validators.required]),
    arabicName: new FormControl("", [Validators.required]),
    active: new FormControl("", ),
  });

  actionDone: boolean = false;
  constructor(private newsCategoryService: NewsCategoryService, private router: Router,private authSerivce: AuthService, private snack: MatSnackBar) { 
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
      this.filterStart = 0;
      //console.log('page index ='+event.pageIndex);
      this.start = event.pageIndex;
      this.end = this.pageLength;
      //console.log('from page event if = ',this.start, this.end)
      this.updateTable(this.start, this.end, '');
    }else{
      this.start = 0
      this.filterStart = event.pageIndex+1;
      this.end = this.filterSize;
      //console.log('from page event else = ',this.filterStart, this.pageLength,this.filterText)
      this.updateTable(this.filterStart, this.pageLength, this.filterText);
    }
  }

  updateTable(start, limit, searchText) {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false

    this.newsCategoryService.getAllNewsCategories(start, limit, searchText).subscribe(
      res => {
        //console.log('response');
        //console.log(res);
        this.dataLength = res['totalCount'];
        this.dataSource = res['newsCategroyDtos'];       
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
    //console.log('select ',this.selected)
    if (keyPress === "Enter") {

      this.paginator.pageIndex = 0;
      this.filterStart = 0;
      this.isFilter = true
      this.updateTable(this.filterStart, this.pageLength, this.filterText);

    }
    if (!this.filterText) {
      this.paginator.pageIndex = 0;
      this.start = 0;
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

  getNewsCategoryDetail(data) {
    this.dataLoaded = true;
    this.actionDone = false;
    this.serviceError = false
    this.openModalButton.nativeElement.click();
    //console.log(data)
    this.myGroup.get('englishName').setValue(data.englishName);
    this.myGroup.get('arabicName').setValue(data.arabicName);
    this.updatedId=data.id;
  }

  updateNewsCategory() {
    // if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.Benefit.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.edit).length==0){
    //     this.snack.open('You do not have access to edit ', 'OK',{
    //       duration: 5000
    //     });
    // }else{
        this.updateNewsCat = false;
        this.editNewsCategory = {
          id:this.updatedId,
          englishName: this.myGroup.get('englishName').value,
          arabicName:  this.myGroup.get('arabicName').value
        }
        //console.log('before send edit object',)
        this.newsCategoryService.editNewsCategory(this.editNewsCategory).subscribe(
        res => {
            //console.log(res)
            this.updateNewsCat = true;
            this.closeModal.nativeElement.click();
            //console.log('this.start = ' , this.start,' , this.pageLength, = ' ,this.pageLength,)
            this.updateTable(this.start, this.pageLength, '');
            this.snack.open('The News Category is updated', 'OK',{
              duration: 5000
            });
        }, e => {
            this.updateNewsCat = true;
            this.errorUpdateNewsCategory = true;
            if (e['status'] == 500) {
              this.msgUpdateNewsCategory = e.error['message']
            } else {
              this.msgUpdateNewsCategory = 'Service not avaliable,Try again later.'
            }
          this.goToDivErrorMsg();
      }
    )//}
  }

  deleteId: any;
  selectedDeleteRow(data: any) {    
    this.actionDone = false;
    this.serviceError = false
    this.deleteId = data.id;
    this.modalMsg = "Are you sure you want to delete this News Category: " + data.englishName + "?"
  }

  deleteSelectedRow() {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false
    this.newsCategoryService.deleteNewsCategory(this.deleteId).subscribe(
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
