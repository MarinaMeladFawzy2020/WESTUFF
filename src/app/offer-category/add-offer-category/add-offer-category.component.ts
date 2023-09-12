import { Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AddOfferCategory } from 'src/app/Models/AddOfferCategory';
import { AddTopicRequest } from 'src/app/Models/AddTopicRequest';
import { Module, Roles } from 'src/app/Models/ModuleRoles';
import { AuthService } from 'src/app/service/auth.service';
import { OffersService } from 'src/app/service/offer.service';

@Component({
  selector: 'app-add-offer-category',
  templateUrl: './add-offer-category.component.html',
  styleUrls: ['./add-offer-category.component.css']
})
export class AddOfferCategoryComponent implements OnInit {

  

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
  offerUrl: any = '/assets/images/placeholder.jpg'

  pageEvent: PageEvent;
  filterArray;
  errorMsg="Service not avaliable now,Try again later.";
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
  filteredmodule:Module;
  rolesList: Roles[];
  entitySpocPersonId;
  newOfferCategory:AddOfferCategory;
  myGroup = new FormGroup({
    englishName: new FormControl("", [Validators.required]),
    arabicName: new FormControl("", [Validators.required]),
    sheet: new FormControl("", [Validators.required]),

  });
  rolesCheck = [];
  file: File = null; // Variable to store file 
  fileName: any;
 Modules:any;

  actionDone: boolean = false;
  constructor(private authService: AuthService
    , private offersService: OffersService
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

  async ngOnInit() {
    this.actionDone = false
    this.serviceError = false
    //this.myGroup.controls['rolesCheck'].setValue(this.rolesCheck);
    this.dataLoaded=true;
    //this.myGroup.get('active').setValue(false);
    
  }


  addTopic() {

    this.dataLoaded = false;
    this.serviceError = false;
    this.actionDone = false;
    var fileName = this.file;

    this.newOfferCategory = {
      
      englishName: this.myGroup.get('englishName').value,
      arabicName: this.myGroup.get('arabicName').value

    }

    //console.log(this.newOfferCategory);

    
    this.offersService.addOfferCategory(this.newOfferCategory,fileName).subscribe(
      res => {
        //console.log(res)
        this.dataLoaded = true;
        this.returnedMsg ="Offer Category Added Successfully"
        this.actionDone = true;
        this.added.emit(true);
        this.resetForm();
        this.goToDivMsg();
      }, e => {
        this.dataLoaded = true;
        this.serviceError = true;
        if (e['status'] == 500||400) {
          this.errorMsg = e.error['message']
        } else {
          this.errorMsg = 'Service not avaliable now,Try again later.'
        }
        this.goToDivErrorMsg();
      }
    )
  }

  
 

  resetForm() {

    this.offerUrl= '/assets/images/placeholder.jpg';
    this.formGroupDirective.resetForm();//this.myGroup.reset()
  //   Object.keys(this.myGroup.controls).forEach(key =>{
  //     this.myGroup.controls[key].setErrors(null)
  //  });
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
