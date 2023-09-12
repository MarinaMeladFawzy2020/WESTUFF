import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { CorrespondenceDetailResponse } from 'src/app/Models/CorrespondenceDetailResponse';
import { EditCorrespondenceCategory } from 'src/app/Models/EditCorrespondenceCategory';
import { EditCorrespondenceRequest } from 'src/app/Models/EditCorrespondenceRequest';
import { MedicalInfoDetailsById } from 'src/app/Models/MedicalInfoDetaildById';
import { AuthService } from 'src/app/service/auth.service';
import { CorrespondenceService } from 'src/app/service/correspondence.service';
import { config } from 'src/config';
import { ModalCorrespondenceComponent } from '../modal-correspondence/modal-correspondence.component';

@Component({
  selector: 'app-list-correspondence',
  templateUrl: './list-correspondence.component.html',
  styleUrls: ['./list-correspondence.component.css']
})
export class ListCorrespondenceComponent implements OnInit {

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('divErrorfocus') divErrorfocus: ElementRef;

  dataSource: any;
  dataLoaded = false;
  actionDone: boolean = false;
  filterText = '';
  dataLength: number;
  isFilter = false;
  end: number;
  defaultData: any;
  pageLength = 5;
  start = 1;
  filterStart = 1;
  filterSize = 5;
  serviceError = false;
  errorMsg;
  filterArray;

  modalMsg;
  deleteId: any;
  returnedMsg;

  isUploadFile
  file: File = null; // Variable to store file 

  selectedCorrespondenceCategory = [];

  editCorrespondenceRequest: EditCorrespondenceRequest;

  constructor(private correspondenceService: CorrespondenceService,
     private authSerivce: AuthService, public dialog: MatDialog, private snack: MatSnackBar ) {
    
   }

  async ngOnInit(): Promise<void> {
    this.updateTable(this.start, this.pageLength, '',this.selectedCorrespondenceCategory);
  }

  updateTable(start, limit, searchText, selectedCorrespondenceCategory) {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false

    this.correspondenceService.getCorrespondence(start, limit, searchText,selectedCorrespondenceCategory).subscribe(
      res => {
        this.dataLength = res['totalCount'];
        this.dataSource = res['items'];
        this.defaultData = res;
        this.dataLoaded = true;
        this.filterArray = new MatTableDataSource(this.defaultData);
      }, e => {
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

  updatePage(event) {
   
    this.actionDone = false
    this.serviceError = false
    if (!this.isFilter) {
      this.filterStart = 1;
      this.start = event.pageIndex+1;
      this.end = this.pageLength;
      this.updateTable(this.start, this.end, '',this.selectedCorrespondenceCategory);
    } else {
      this.start = 1
      this.filterStart = event.pageIndex;
      this.end = this.filterSize;
      this.updateTable(this.filterStart, this.pageLength, this.filterText,this.selectedCorrespondenceCategory);
    }
    //console.log('update page = ' ,this.start, this.end )
    //console.log('update page 2= ' ,this.filterStart, this.pageLength )
  }

  onChange() {
    this.updateTable(this.start, this.pageLength, '', this.selectedCorrespondenceCategory);
  }
  goToDivErrorMsg() {
    setTimeout(() => {
      this.divErrorfocus.nativeElement.scrollIntoView();
    }, 0);
  }

  // open modal
  openDialog(id?, data?): void {
    let dialogRef;
    let title = 'Edit Correspondence';
    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.Correspondence.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.edit).length == 0) {
      this.snack.open('You do not have access to edit ', 'OK', {
        duration: 5000
      });
    }
    else {
      dialogRef = this.dialog.open(ModalCorrespondenceComponent, {
        width: '700px',
        data: {title: title,payload: data,correspondenceId: id}
      });
    }

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
     // this.dataLoaded = false;
     // //console.log('result  = ',result)
      this.editCorrespondenceRequest = {
        id:result.id,
        title: result.title,
        isActive:result.isActive,
        correspondenceCategoryId:result.correspondenceCategoryCustom.id,
        uploadedFile:result.uploadedFile
      };
  
      ////console.log('result.uploadFiles from modal = ', result.uploadedFile)
      ////console.log('before send request = ', this.editCorrespondenceRequest)
      this.file = result.fileURL

        this.correspondenceService.editCorrespondence(this.editCorrespondenceRequest, this.file).subscribe(
        res => {
           //console.log(res)
           this.dataLoaded = true;

            this.updateTable(this.start, this.pageLength, '',[]);
            this.snack.open('Correspondnece Updated Successfully', 'OK', {
              duration: 5000
            });
            this.dataLoaded = false;

          }, e => {
           //console.log(e)
           this.dataLoaded = true;

           this.snack.open('Error pleas try again later', 'Failed', {
             duration: 5000
             });
           })
       //console.log(result)
     });
  }

  selectDeleteRow(data: any) {
    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.Correspondence.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.delete).length == 0) {
      this.snack.open('You do not have access to edit ', 'OK', {
        duration: 5000
      });
    }
    else {
    this.actionDone = false;
    this.serviceError = false;
    this.deleteId = data.id;
    this.modalMsg = "Are you sure you want to delete this correspondence : " + data.title + "?"
    }
  }

  deleteSelectedRow() {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false

    this.correspondenceService.deleteCorrespondence(this.deleteId).subscribe(
      (response) => {
        this.dataLoaded = true;
        this.updateTable(this.start, this.pageLength, '', this.selectedCorrespondenceCategory);
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

  applyFilter(event) {

    this.actionDone = false
    this.serviceError = false
    this.serviceError = false

    var filterValue = event.target.value
    var keyPress = event.key
    //console.log('applyFilter ' + filterValue.trim().toLowerCase())
    this.filterText = filterValue.trim().toLowerCase();
    ////console.log('selecteddddddd', this.selected)
    if (keyPress === "Enter") {

      this.paginator.pageIndex = 0;
      this.filterStart = 1;
      this.isFilter = true
      this.updateTable(this.filterStart, this.pageLength, this.filterText, this.selectedCorrespondenceCategory);

    }
    if (!this.filterText) {
      this.paginator.pageIndex = 0;
      this.start = 1;
      this.isFilter = false;
      this.updateTable(this.start, this.pageLength, this.filterText, this.selectedCorrespondenceCategory);
    }
  }

  
}
