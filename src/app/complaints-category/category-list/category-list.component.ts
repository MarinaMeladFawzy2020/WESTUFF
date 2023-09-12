import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ComplaintsService } from 'src/app/service/complaints.service';
import { VotingService } from 'src/app/service/voting.service';
import { CategoryAddComponent } from '../category-add/category-add.component';


@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  [x:string]:any;
  pageLength = 5;
  dataLength: number;
  start = 0;
  end: number;
  filterStart = 0;
  filterSize = 5;
  isFilter = false;
  filterArray;
  defaultData: any;


  dataLoaded: boolean = false;
  serviceError : boolean = false;
  actionDone: boolean = false;

  errorMsg = '';
  returnedMsg ='';
  modalMsg = '';
  dataSource :any =[];
  deleteId: any;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('divfocus') divfocus: ElementRef;
  @ViewChild('divErrorfocus') divErrorfocus: ElementRef;
  constructor(private dataApi1: VotingService, private dataApi:ComplaintsService , private authSerivce: AuthService, public dialog: MatDialog, private snack: MatSnackBar, private activatedRoute: ActivatedRoute, private route: Router) { }

  ngOnInit(): void {

    this.updateTable(this.start, this.pageLength, '');

  }

  updateTable(start, limit, searchText) {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false;
    this.dataApi.getAllcategory(start, limit).subscribe(
      (res:any) => {
        console.log(res)
        this.dataLength = res.totalCount;
        this.dataSource = res.body;
        this.defaultData = res;
        this.dataLoaded = true;
        this.filterArray = new MatTableDataSource(this.defaultData);
        this.filterArray1 = res.body;
      }, e => {
        console.log(e)
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


  filterText
  updatePage(event) {
    this.actionDone = false
    this.serviceError = false
    if (!this.isFilter) {
      this.filterStart = 0;
      this.start = event.pageIndex;
      this.end = this.pageLength;
      this.updateTable(this.start, this.end, '');
    } else {
      this.start = 0
      this.filterStart = event.pageIndex;
      this.end = this.filterSize;
      this.updateTable(this.filterStart, this.pageLength, this.filterText);
    }
  }



  applyFilter(event) {
    this.actionDone = false
    this.serviceError = false
    this.serviceError = false
    var filterValue = event.target.value
    var keyPress = event.key
    this.filterText = filterValue.trim().toLowerCase();

    if (keyPress === "Enter") {
      this.paginator.pageIndex = 0;
      this.filterStart = 0;
      this.isFilter = true;
       this.start = 0

     this.filteredArray =  this.filterArray1.filter((obj) => obj.englishName.toLowerCase().includes(this.filterText) || obj.arabicName.includes(this.filterText));
      console.log(this.filteredArray)
      this.dataSource = this.filteredArray;
      // this.updateTable(this.filterStart, this.pageLength, this.filterText);
      this.dataLength = this.filteredArray.length;

    }
    if (!this.filterText) {
      this.paginator.pageIndex = 0;
      this.start = 0;
      this.isFilter = false;
      this.dataSource = this.filterArray1
     // this.updateTable(this.start, this.pageLength, '');
    }
  }









  goToDivErrorMsg() {
    setTimeout(() => {
      this.divErrorfocus.nativeElement.scrollIntoView();
    }, 0);
  }

  goToDivMsg() {
    setTimeout(() => {
      this.divfocus.nativeElement.scrollIntoView();
    }, 0);
  }

  editComplaintCategory(data){
    console.log(data);
    this.route.navigateByUrl("/complaintCategoryById"
    , { state: { categoryId: data.id, name: data.title } });
    sessionStorage.setItem("categoryId" , data.id);
  }


  openDialog(isNew?, id?, data?): void {
    let dialogRef;
    let title = isNew ? 'Add New Category' : 'Edit Category';
    if (isNew) {
      dialogRef = this.dialog.open(CategoryAddComponent, {
        width: '700px',
        data: { title: title, payload: data, new: isNew, categoryId: id }
      });
    }

    dialogRef.afterClosed().subscribe(result => {
      console.log("afterClosed")
      console.log(result)
      if(result !== false){
        this.updateTable(this.start, this.pageLength, '');
      }
    });
  }

}
