import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EditOfferCategory } from 'src/app/Models/EditOfferCategory';
import { EditTopicRequest } from 'src/app/Models/EditTopicRequest';
import { OffersService } from 'src/app/service/offer.service';
import { config } from 'src/config';
import { pathToFileURL } from 'url';
import { AuthService } from '../../service/auth.service';
import { NotificationsService } from '../../service/notifications.service';

@Component({
  selector: 'app-list-offer-category',
  templateUrl: './list-offer-category.component.html',
  styleUrls: ['./list-offer-category.component.css']
})
export class ListOfferCategoryComponent implements OnInit {


  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('divErrorfocus') divErrorfocus: ElementRef;
  @ViewChildren("CheckBoxForm") checkBoxs: QueryList<MatCheckbox>;
  @ViewChild('divfocus') divfocus: ElementRef;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('openModalButton') openModalButton: ElementRef;
  

offerUrl: any = '/assets/images/placeholder.jpg'
file: File = null; 
imageName:any;
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
//errorUpdateRoles; msgUpdateRoles updateRoles = true;
errorUpdateOfferCategory;
msgUpdateOfferCategory
updateOfferCat = true;
editOfferCategory:EditOfferCategory;
updatedId;
  myGroup = new FormGroup({
    englishName: new FormControl("", [Validators.required]),
    arabicName: new FormControl("", [Validators.required]),
    sheet: new FormControl("", [Validators.required]),
    active: new FormControl("", ),
    



  });


  actionDone: boolean = false;
  constructor(private offersService: OffersService
    , private router: Router,private authSerivce: AuthService, private snack: MatSnackBar) { 

//console.log("this.submittable",this.submittable)
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
    //console.log("this.submittable",this.submittable)

    
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

    this.offersService.getAllOfferCategory(start, limit, searchText).subscribe(
      res => {
        //console.log(res)
        this.dataLength = res['totalCount'];

        this.dataSource = res['offerCategroyDtos'];
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

  getOfferCategoryDetail(data) {
    this.dataLoaded = true;
    this.actionDone = false;
    this.serviceError = false
    this.imageName = data.mediaName.replace(/^.*[\\\/]/, '');
   if(data.mediaName)
   {
     this.offerUrl = data.mediaName;
   }

    // this.showModalBox = false;
    this.openModalButton.nativeElement.click();
    //console.log(data)
//     this.editTopic = {
// id:data.id,
// englishName: data.englishName,
// arabicName:  data.arabicName,
// isActive: data.active
//     }
    // this.englishName = data.englishName;
    // this.arabicName = data.arabicName;
    // this.active = data.active;
    //call serive 
    this.myGroup.get('englishName').setValue(data.englishName);
    this.myGroup.get('arabicName').setValue(data.arabicName);
    // this.myGroup.get('active').setValue(data.active);
    this.updatedId=data.id;
    //console.log('ttttttttt',data.id)
  }
  updateOfferCategory() {
    // //console.log(this.branchName + ' ' + this.branchId)


    if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.Benefit.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.edit).length==0)
      {
        this.snack.open('You do not have access to edit ', 'OK',{
          duration: 5000
        });
      }

      else{

    var fileName = this.file;
    var isSameImage = false;
    if(fileName.name != this.imageName)
        isSameImage = true; 
    this.updateOfferCat = false;
    this.editOfferCategory = {
      id:this.updatedId,
      englishName: this.myGroup.get('englishName').value,
      arabicName:  this.myGroup.get('arabicName').value,
      uploadFiles : isSameImage
          }
          //console.log('before send edit object',)
    this.offersService.editOfferCategory(this.editOfferCategory,fileName).subscribe(
      res => {
        //console.log(res)
        this.updateOfferCat = true;
        this.closeModal.nativeElement.click();
        this.updateTable(this.start, this.pageLength, '');
        this.snack.open('The Offer Category is updated', 'OK',{
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
    )
  }


  }




  deleteId: any;
  selectedDeleteRow(data: any) {

  
    
    this.actionDone = false;
    this.serviceError = false

    this.deleteId = data.id;
    this.modalMsg = "Are you sure you want to delete this Offer Category: " + data.englishName + "?"
    //console.log('this.delete id ' + this.deleteId);
    
  }

  deleteSelectedRow() {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false


    this.offersService.deleteOfferCategoryById(this.deleteId).subscribe(
      (response) => {
        this.dataLoaded = true;
        //after delete get new data from database 
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
      this.offerUrl = reader.result;
    }
    this.file = event.target.files[0];
  }


}

