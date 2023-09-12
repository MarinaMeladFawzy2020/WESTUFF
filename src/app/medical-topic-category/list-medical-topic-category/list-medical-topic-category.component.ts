import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EditMedicalTopicCategory } from 'src/app/Models/EditMedicalTopicCategory';
import { MedicalTopicService } from 'src/app/service/medical-topic.service';
import { config } from 'src/config';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-list-medical-topic-category',
  templateUrl: './list-medical-topic-category.component.html',
  styleUrls: ['./list-medical-topic-category.component.css']
})
export class ListMedicalTopicCategoryComponent implements OnInit {

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
  selected=-1;
  selectedTopicId;
  filterText='';
  topicID;

  englishName;
  arabicName;
  active;
  errorUpdateMedicalTopicCategory;
  msgUpdateMedicalTopicCategory
  updateOfferCat = true;
  editMedicalTopicCategory:EditMedicalTopicCategory;
  updatedId;
  
  myGroup = new FormGroup({
    englishName: new FormControl("", [Validators.required]),
    arabicName: new FormControl("", [Validators.required]),
    active: new FormControl("", ),
  });


  actionDone: boolean = false;
  constructor(private medicalTopicService: MedicalTopicService, private router: Router,private authSerivce: AuthService, private snack: MatSnackBar) { 
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

    this.medicalTopicService.getAllMedicalTopicCategory(start, limit, searchText).subscribe(
      res => {
        //console.log('response = '+res['medicalInfoTopicCategroyDtos'])
        this.dataLength = res['totalCount'];

        this.dataSource = res['medicalInfoTopicCategroyDtos'];        
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

  onAddedTransfer(event){

    //console.log(event);
    this.updateTable(this.start, this.pageLength, '');

  }

  getMedicalTopicCategoryDetail(data) {
    this.dataLoaded = true;
    this.actionDone = false;
    this.serviceError = false

    this.openModalButton.nativeElement.click();
    //console.log(data)
    this.myGroup.get('englishName').setValue(data.englishName);
    this.myGroup.get('arabicName').setValue(data.arabicName);

    this.updatedId=data.id;

  }
  updateMedicalTopicCategory() {

    if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.Medical.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.editTopic).length==0)
      {
        this.snack.open('You do not have access to edit ', 'OK',{
          duration: 5000
        });
      }
      else{

    this.updateOfferCat = false;
    this.editMedicalTopicCategory = {
      id:this.updatedId,
      englishName: this.myGroup.get('englishName').value,
      arabicName:  this.myGroup.get('arabicName').value
          }
          //console.log('before send edit object',)
    this.medicalTopicService.editMedicalTopicCategory(this.editMedicalTopicCategory).subscribe(
      res => {
        //console.log(res)
        this.updateOfferCat = true;
        this.closeModal.nativeElement.click();
        this.updateTable(this.start, this.pageLength, '');
        this.snack.open('The Medical Topic Category is updated', 'OK',{
          duration: 5000
        });
      }, e => {
        this.updateOfferCat = true;

        this.errorUpdateMedicalTopicCategory = true;
        if (e['status'] == 500) {
          this.msgUpdateMedicalTopicCategory = e.error['message']
        } else {
          this.msgUpdateMedicalTopicCategory = 'Service not avaliable,Try again later.'
        }
        this.goToDivErrorMsg();
      }
    )
  }
}
    deleteId: any;
    selectedDeleteRow(data: any) {
    
    this.actionDone = false;
    this.serviceError = false

    this.deleteId = data.id;
    this.modalMsg = "Are you sure you want to delete this Medical Topic Category: " + data.englishName + "?"
    //console.log('this.delete id ' + this.deleteId);
    
  }

  deleteSelectedRow() {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false


    this.medicalTopicService.deleteMedicalTopicCategoryById(this.deleteId).subscribe(
      (response) => {
        this.dataLoaded = true;
        
        this.updateTable(this.start, this.pageLength, '');
        this.returnedMsg = response['englishMessage']
        this.actionDone = response['actionDone'];
        this.snack.open('Action Performed Successfully', 'OK',{
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

