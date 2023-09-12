import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { config } from 'src/config';
import { EditNewsRequest } from 'src/app/Models/edit-news-request';
import { News } from 'src/app/Models/news';
import { NewsDto } from 'src/app/Models/NewsDto';
import { ModalOfferComponent } from 'src/app/offers/modal-offer/modal-offer.component';
import { AuthService } from 'src/app/service/auth.service';
import { NewsService } from 'src/app/service/news.service';
import { EditNewsComponent } from '../edit-news/edit-news.component';
@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit {

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
  errorUpdateTopics;
  msgUpdateTopics
  updateTopics = true;
  updatedId;
  updatedImage;
  editNews: EditNewsRequest;
  isUploadFile
  file: File = null; // Variable to store file 
  searchNews = new FormControl(null);
  deleteId: any;

  myGroup = new FormGroup({
    title: new FormControl("", [Validators.required]),
    description: new FormControl("", [Validators.required]),
    publishDate: new FormControl("", [Validators.required]),
    addedDate: new FormControl("", [Validators.required]),
    newsDate: new FormControl("", [Validators.required]),
    showInSlider: new FormControl(""),
    createdBy: new FormControl("", [Validators.required]),
    active: new FormControl("", [Validators.required]),
    sheet: new FormControl("", [Validators.required]),
  });


  actionDone: boolean = false;
  constructor(private newsService: NewsService, public dialog: MatDialog
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
    //console.log(this.searchNews.value);
    this.updateTable(this.start, this.pageLength, this.searchNews.value, this.selected);

  }

  selectionChanged(event) {
    //console.log('drop down ', event + "size" + event.value.length)
    this.selected = []

    for (var n = 0; n < event.value.length; n++) {
      this.selected.push(event.value[n].id)
    }
    //console.log(this.selected)
    //console.log(this.filterText)
    if (this.filterText) {
      this.updateTable(this.start, this.pageLength, this.searchNews.value, this.selected);
    } else
      this.updateTable(this.start, this.pageLength, this.filterText, this.selected);
  }

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
    clearOnSelection: true // clears search criteria when an option is selected if set to true, default is false
  }

  async ngOnInit(): Promise<void> {

    this.updateTable(this.start, this.pageLength, '', this.searchNews.value);
    this.Modules = await this.newsService.getNewsCategoryLookup().toPromise();
    //console.log(this.Modules);

  }

  updatePage(event) {
    this.actionDone = false
    this.serviceError = false
    if (!this.isFilter) {
      this.filterStart = 0;

      this.start = event.pageIndex;
      this.end = this.pageLength;
      this.updateTable(this.start, this.end, this.searchNews.value, this.selected);
    } else {
      this.start = 0

      this.filterStart = event.pageIndex;
      this.end = this.filterSize;
      this.updateTable(this.filterStart, this.pageLength, this.filterText, this.selected);
    }
  }
  updateTable(start, limit, searchText, newsCategoryId) {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false

    this.newsService.getAllNews(start, limit, searchText, newsCategoryId).subscribe(
      res => {
        //console.log(res)
        this.dataLength = res['totalCount'];
        this.dataSource = res['newsDto'];
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
      this.updateTable(this.filterStart, this.pageLength, this.filterText, this.selected);

    }
    if (!this.filterText) {
      this.paginator.pageIndex = 0;
      this.start = 0;
      this.isFilter = false;
      this.updateTable(this.start, this.pageLength, this.searchNews.value, this.selected);
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

  onAddedTransfer(event) {

    //console.log(event);
    this.updateTable(this.start, this.pageLength, false, []);

  }
  /////////////////// open dialog Edit Modal /////////////////////////////
  openDialog( id?, data?): void {
    let dialogRef;
    // let title = isNew;
    // isNew = 'Edit News';
    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.News.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.edit).length == 0) {
      this.snack.open('You do not have access to edit ', 'OK', {
        duration: 5000
      });
    }
    else {
      dialogRef = this.dialog.open(EditNewsComponent, {
        width: '700px',
        data: { title: 'News', payload: data, newsId: id }
      });
    }
    //console.log('updating.........')
    dialogRef.afterClosed().subscribe((result : News ) => {
      if (!result) {
        return;
      }
      
      this.dataLoaded = false;
      //console.log(result);
      this.editNews = {
        id: result.id,
        newsCategoryId: result.newsCategory.id,
        title: result.title,
        description: result.description,
        publishDate: result.publishDate,
        newsDate: result.newsDate,
        uploadMedia: result.uploadMedia,
        showInSlider:result.showInSlider,
        active:result.active
      }
      //console.log('result.isUploadFile', result.uploadMedia)
      this.file = result.files
      //console.log('result.files', result.files)
      var fileNameImage = this.file
      //console.log('fileNameImage', fileNameImage)
      //console.log('edit News Dto = ', this.editNews)
      this.newsService.editNews(this.editNews, fileNameImage).subscribe(
        res => {
          //console.log(res)
          this.dataLoaded = true;
          this.updateTable(this.start, this.pageLength, this.searchNews.value, []);
          this.snack.open('News Updated Successfully', 'OK', {
            duration: 5000
          });
          this.dataLoaded = false;

        }, (e :HttpErrorResponse)=> {
          //console.log('error when calling editNews ...');
          //console.log(e.message)
          this.dataLoaded = true;
          this.snack.open('Error pleas try again later', 'Failed', {
            duration: 5000
          });
        }

      )

      //console.log(result)
    });
  

}

  selectedDeleteRow(data: any) {
    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.News.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.delete).length == 0) {
      this.snack.open('You do not have access to edit ', 'OK', {
        duration: 5000
      });
    }
    else {
    this.actionDone = false;
    this.serviceError = false;
    this.deleteId = data.id;
    this.modalMsg = "Are you sure you want to delete this News : " + data.title + "?"
    //console.log('this.delete id ' + this.deleteId);
    }
  }
  deleteSelectedRow() {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false

    this.newsService.deleteNewsById(this.deleteId).subscribe(
      (response) => {
        this.dataLoaded = true;
        //after delete get new data from database 
        this.updateTable(this.start, this.pageLength, this.searchNews.value, this.selected);
        this.returnedMsg = response['englishMessage']
        this.actionDone = response['actionDone'];
        this.snack.open('Action Performed Successfully', 'OK', {
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
