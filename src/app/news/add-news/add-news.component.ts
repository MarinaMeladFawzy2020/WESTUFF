import { Component, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroupDirective, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Module, Roles } from 'src/app/Models/ModuleRoles';
import { NewOfferDto } from 'src/app/Models/NewOffer';
import { NewsDto } from 'src/app/Models/NewsDto';
import { AuthService } from 'src/app/service/auth.service';
import { NewsService } from 'src/app/service/news.service';

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.css']
})
export class AddNewsComponent implements OnInit {

  
  @ViewChild('paginator') paginator: MatPaginator;
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
  filteredmodule: Module;
  rolesList: Roles[];
  entitySpocPersonId;

  myGroup = new FormGroup({
    dataModel: new FormControl([], [Validators.required]),
    title: new FormControl("", [Validators.required]),
    description: new FormControl("", [Validators.required]),
    publishDate: new FormControl("", [Validators.required]),
    newsDate: new FormControl(""),
    active: new FormControl("", [Validators.required]),
    showInSlider: new FormControl("", [Validators.required]),
    sheet: new FormControl("", [Validators.required]),
  
  });
  rolesCheck = [];
  fileImage: File = null; // Variable to store file 
  Modules: any;
  newsUrl: any = '/assets/images/placeholder.jpg';
  isuplaodImage: boolean;
  selectedModelId;
  branchListOptions: any;
  config = {
    displayKey: "arabicName", //if objects array passed which key to be displayed defaults to description
    search: true, //true/false for the search functionlity defaults to false,
    height: '150px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: 'Select News Category', // text to be displayed when no item is selected defaults to Select,
    customComparator: () => {
    }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    limitTo: 5,// options.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search', // label thats displayed in search input,
    // searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
  }
  actionDone: boolean = false;
 
  constructor(private authService: AuthService,
    private newsService: NewsService
    , private router: Router) {
    this.myGroup.valueChanges.subscribe(res => {
      if (this.myGroup.valid) {
        this.submittable = true;
        //console.log(this.myGroup.value)
      } else {
        this.submittable = false;
      }
    });
  }


  newsDto: NewsDto = {   
    newsCategoryId: null,
    title:'',
    description:'',
    active:false,
    publishDate:null,
    newsDate:null,
    showInSlider:false,
    uploadMedia:false,
  };


  async ngOnInit() {
    this.actionDone = false
    this.serviceError = false
    this.dataLoaded = true;
    try {
      //call getRoles
      this.Modules = await this.newsService.getNewsCategoryLookup().toPromise();
      //console.log(this.Modules);
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

  selectionChanged(event) {
    //console.log('drop down ---', this.myGroup.controls['dataModel'].value['id'])
    this.selectedModelId = this.myGroup.controls['dataModel'].value['id'];
    //console.log(this.selectedModelId)

  }
  roleSelected(id) {
    if (this.rolesCheck.indexOf(id) != -1) { return true }
    else {
      return false
    }
  }
  addNews() {
    this.dataLoaded = false;
    this.serviceError = false;
    this.actionDone = false;

    var fileName = this.fileImage;
    this.newsDto.title = this.myGroup.get('title').value;
    this.newsDto.description = this.myGroup.get('description').value;
    this.newsDto.newsCategoryId = this.selectedModelId;
    this.newsDto.publishDate = this.myGroup.get('publishDate').value;
    this.newsDto.newsDate = this.myGroup.get('newsDate').value;
    this.newsDto.showInSlider = this.myGroup.get('showInSlider').value;
    this.newsDto.active = this.myGroup.get('active').value;
    this.newsDto.uploadMedia= this.isuplaodImage;

    this.newsService.addNews(this.newsDto, fileName).subscribe(
      res => {
        //console.log(res)
        this.dataLoaded = true;
        this.returnedMsg = "News Added Successfully"
        this.actionDone = true;
        this.added.emit(true);
        this.resetForm();
        this.goToDivMsg();
      }, e => {
        this.dataLoaded = true;
        this.serviceError = true;
        if (e['status'] == 500) {
          this.errorMsg = e.error['message']
        } else {
          this.errorMsg = 'Service not avaliable now,Try again later.'
        }
        this.goToDivErrorMsg();
      }
    )
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
      this.newsUrl = reader.result;
    }
    this.fileImage = event.target.files[0];
    this.isuplaodImage=true;
  }

  resetForm() {
    this.formGroupDirective.resetForm();
    this.myGroup.controls['dataModel'].setValue([]);
    this.newsUrl = '/assets/images/placeholder.jpg'
    this.checkBoxs.forEach((element) => {
      element.checked = false;
    });
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
