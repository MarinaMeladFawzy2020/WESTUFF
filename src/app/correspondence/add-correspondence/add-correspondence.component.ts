import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { AddCorrespondenceRequest } from 'src/app/Models/AddCorrespondenceRequest';
import { CorrespondenceService } from 'src/app/service/correspondence.service';

@Component({
  selector: 'app-add-correspondence',
  templateUrl: './add-correspondence.component.html',
  styleUrls: ['./add-correspondence.component.css']
})
export class AddCorrespondenceComponent implements OnInit {

  @ViewChild('divErrorfocus') divErrorfocus: ElementRef;
  @ViewChild('divfocus') divfocus: ElementRef;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @Output() added = new EventEmitter<boolean>();

  dataLoaded = false;
  serviceError = false;
  errorMsg;
  returnedMsg;
  actionDone: boolean = false;

  submittable = false;

  file: File = null; // Variable to store file 

  Modules: any;
  selectedModelId;
  
  config = {
    displayKey: "arabicName",
    search: true, 
    height: '150px', 
    placeholder: 'Select Medical Information Category', 
    customComparator: () => {
    }, 
    limitTo: 5,
    moreText: 'more', 
    noResultsFound: 'No results found!', 
    searchPlaceholder: 'Search', 
  }

  addCorrespondenceRequest: AddCorrespondenceRequest = {
    title: '',
    isActive: false,
    correspondenceCategoryId: 0,
    uploadedFile: true
  };

  myGroup = new FormGroup({
    dataModel: new FormControl([], [Validators.required]),
    title: new FormControl("", [Validators.required]),
    isActive: new FormControl(""),
    uploadedFile: new FormControl(true),
    sheet: new FormControl("")
  });

  constructor(private correspondenceService: CorrespondenceService) {
    this.myGroup.valueChanges.subscribe(res => {
      if (this.myGroup.valid) {
        this.submittable = true;
        //console.log('myGroup.value from constructor',this.myGroup.value)
      } else {
        this.submittable = false;
      }
    });
   }  

  async ngOnInit() {
    this.dataLoaded=true;
    this.serviceError = false
    try {
      this.Modules = await this.correspondenceService.getAllCorrespondenceCategories().toPromise();
    } catch (e) {
      //console.log(e)
      this.serviceError = true;
      if (e['status'] == 500) {
        this.errorMsg = e.error['message']
      } else {
        this.errorMsg = 'Service not avaliable,Try again later.'
      }
      this.goToDivErrorMsg();
    }

  }

  saveCorrespondence() {
    this.dataLoaded = false;
    this.serviceError = false;
    this.actionDone = false;

    var fileName = this.file;

    this.addCorrespondenceRequest.title = this.myGroup.get('title').value
    this.addCorrespondenceRequest.correspondenceCategoryId = this.selectedModelId;
    this.addCorrespondenceRequest.isActive = this.myGroup.get('isActive').value
    this.addCorrespondenceRequest.uploadedFile = this.myGroup.get('uploadedFile').value

    //console.log('fileName = ', fileName)

    this.correspondenceService.saveCorrespondence(this.addCorrespondenceRequest,fileName).subscribe(
      res => {
        this.dataLoaded = true;
        this.returnedMsg ="Correspondence Added Successfully"
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

  selectionChanged(event) {
    this.selectedModelId = this.myGroup.controls['dataModel'].value['id'];
  }

  onChange(event) { 
    //console.log('from start onChange')
    this.file = event.target.files[0]; 
    //console.log(this.file)
}

  resetForm() {
    this.formGroupDirective.resetForm();
    this.myGroup.controls['dataModel'].setValue([]);
    this.myGroup.controls['rolesCheck'].setValue([]);
    this.submittable = false;
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
