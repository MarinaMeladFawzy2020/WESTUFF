import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { IntiativesService } from 'src/app/service/initiatives.service';
import { NotificationsService } from 'src/app/service/notifications.service';
import { QuestionaireService } from 'src/app/service/questionaire.service';
import { config } from 'src/config';
import { AuthService } from '../../service/auth.service';
import { ModalInitiativesComponent } from '../modal-initiatives/modal-initiatives.component';
import { MatDialog } from '@angular/material/dialog';
import { EditIntiatives } from 'src/app/Models/EditIntiatives';
import { IntiativesDetailsById } from 'src/app/Models/IntiativesById';


@Component({
  selector: 'app-list-initiatives',
  templateUrl: './list-initiatives.component.html',
  styleUrls: ['./list-initiatives.component.css']
})
export class ListInitiativesComponent implements OnInit {


  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('divErrorfocus') divErrorfocus: ElementRef;
  @ViewChildren("CheckBoxForm") checkBoxs: QueryList<MatCheckbox>;
  @ViewChild('divfocus') divfocus: ElementRef;

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

  selected = -1;
  selectedTopicId;
  filterText = '';
  topicID;
  actionDone: boolean = false;
  editIntiatives:EditIntiatives
  file: File = null; // Variable to store file 
  fileVideo: File = null;
  constructor(private intiativesService: IntiativesService, public dialog: MatDialog
    , private router: Router, private authSerivce: AuthService, private snack: MatSnackBar) { }

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
    // change service to call notification List
    //console.log('getBranchManagersList')
    //call service getBranchManagersList
    this.intiativesService.getAllInitiatives(start, limit, searchText).subscribe(
      res => {
        //console.log(res)
        this.dataLength = res['totalCount'];

        this.dataSource = res['items'];
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
    //console.log('selecteddddddd', this.selected)
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

  onAddedTransfer(event) {

    //console.log(event);
    this.updateTable(this.start, this.pageLength, '');

  }







  deleteId: any;
  selectedDeleteRow(data: any) {

    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.Initiatives.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.delete).length == 0) {
      this.snack.open('You do not have access to edit ', 'OK', {
        duration: 5000
      });
    }
    else {
    
    this.actionDone = false;
    this.serviceError = false

    this.deleteId = data.id;
    this.modalMsg = "Are you sure you want to delete this Intiatives: " + data.title + "?"
    //console.log('this.delete id ' + this.deleteId);
    }
  }

  deleteSelectedRow() {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false


    this.intiativesService.deleteIntiatives(this.deleteId).subscribe(
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


/////////////////// open dialog Edit Modal /////////////////////////////

  /////////////////// open dialog Edit Modal /////////////////////////////


  openDialog(isNew?, id?, data?): void {
    //  let data=this.question


    let dialogRef;


    let title = isNew;
    isNew = 'Edit Intiatives';
    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.Initiatives.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.edit).length == 0) {
      this.snack.open('You do not have access to edit ', 'OK', {
        duration: 5000
      });
    }
    else {
      dialogRef = this.dialog.open(ModalInitiativesComponent, {
        width: '700px',
        data: { title: title, payload: data, new: isNew, intiativesId: id }
      });
    }


    //console.log('asssssasasasasasassssssssss')

    dialogRef.afterClosed().subscribe((result : IntiativesDetailsById) => {
      if (!result) {
        // If user press cancel
        return;
      }

      // if(isNew)
      // {
      this.dataLoaded = false;
      //console.log(result)
      this.editIntiatives = {
        id: result.id,
        title: result.title,
        description: result.description,
        publishDate:result.publishDate,
        uploadImage: result.uploadFiles,
        uploadVideo: result.uploadVideos,
        active: result.active
      }
      //console.log('result.uploadFiles', result.uploadFiles)
      //console.log('result.uploadVideos', result.uploadVideos)
      this.file = result.files
      this.fileVideo = result.filesVideo
      var fileNameImage = this.file
      var fileNameVideo = this.fileVideo
      //console.log('fileNameImage', fileNameImage)
      //console.log('fileNameVideo', fileNameVideo)
      //console.log('lll ', this.editIntiatives)
      this.intiativesService.editIntiativesService(this.editIntiatives, fileNameImage, fileNameVideo).subscribe(

        res => {
          //console.log(res)
          this.dataLoaded = true;

          this.updateTable(this.start, this.pageLength, '');
          this.snack.open('Medical Info Updated Successfully', 'OK', {
            duration: 5000
          });
          this.dataLoaded = false;

        }, e => {
          //console.log(e)
          this.dataLoaded = true;

          this.snack.open('Error pleas try again later', 'Failed', {
            duration: 5000
          });
        }

      )

      //console.log(result)
    });
  }


}

