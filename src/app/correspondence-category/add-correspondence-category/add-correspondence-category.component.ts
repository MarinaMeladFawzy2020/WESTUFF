import { Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { AddCorrespondenceCategory } from 'src/app/Models/AddCorrespondenceCategory';
import { Module, Roles } from 'src/app/Models/ModuleRoles';
import { AuthService } from 'src/app/service/auth.service';
import { CorrespondenceService } from 'src/app/service/correspondence.service';

@Component({
  selector: 'app-add-correspondence-category',
  templateUrl: './add-correspondence-category.component.html',
  styleUrls: ['./add-correspondence-category.component.css']
})
export class AddCorrespondenceCategoryComponent implements OnInit {

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  //@ViewChildren("CheckBoxForm") checkBoxs: QueryList<MatCheckbox>;
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
  filteredmodule:Module;
  rolesList: Roles[];

  addCorrespondenceCategory:AddCorrespondenceCategory;

  myGroup = new FormGroup({
    englishName: new FormControl("", [Validators.required]),
    arabicName: new FormControl("", [Validators.required])
  });
  rolesCheck = [];
  //file: File = null; // Variable to store file 
  Modules:any;

  actionDone: boolean = false;
  constructor(private authService: AuthService, private correspondenceService: CorrespondenceService, private router: Router) {
    this.myGroup.valueChanges.subscribe(res => {
        if (this.myGroup.valid) {
          this.submittable = true;
        }else {
          this.submittable = false;
        }
    });
  }

  async ngOnInit() {
    this.actionDone = false
    this.serviceError = false
    this.dataLoaded=true;
  }

  saveCorrespondenceCategory() {
    this.dataLoaded = false;
    this.serviceError = false;
    this.actionDone = false;

    this.addCorrespondenceCategory = {  
      englishName: this.myGroup.get('englishName').value,
      arabicName: this.myGroup.get('arabicName').value
    }

    this.correspondenceService.saveCorrespondenceCategory(this.addCorrespondenceCategory).subscribe(
      res => {
        this.dataLoaded = true;
        this.returnedMsg ="Correspondence Category Added Successfully"
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
    this.formGroupDirective.resetForm();
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
  
}


