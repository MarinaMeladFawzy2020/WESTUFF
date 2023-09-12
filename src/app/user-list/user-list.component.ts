import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { config } from 'src/config';
import { AuthService } from '../service/auth.service';
import { UsersService } from '../service/users.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

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
  //ecrmAccountNo;
  rolesList: any;
  entitySpocPersonId;
  // myGroup = new FormGroup({
  //   name: new FormControl("", [Validators.required]),
  //   username: new FormControl("", [Validators.required]),
  //   email: new FormControl("", [Validators.required, Validators.email]),
  //   mobilenumber: new FormControl("", [Validators.required, , Validators.pattern(new RegExp(/^(01)(0|1|2|5)[0-9]{8}/))]),
  //   dataModel: new FormControl([], [Validators.required]),
  //   rolesCheck: new FormControl([]),
  // });
  rolesCheck = [];
  actionDone: boolean = false;
  constructor(private userService: UsersService
    , private router: Router,private authSerivce: AuthService, private snack: MatSnackBar) { }

  ngOnInit(): void {

   
    this.updateTable(this.start, this.pageLength, '');
  }
  

  filterText;

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

    //console.log('getBranchManagersList')
    //call service getBranchManagersList
    this.userService.getAllUsers(start, limit, searchText).subscribe(
      res => {
        //console.log(res)
        this.dataLength = res['totalCount'];

        this.dataSource = res['usersDto'];
        //this.dataSource = res;
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

    if (keyPress === "Enter") {

      this.paginator.pageIndex = 0;
      this.filterStart = 0;
      this.isFilter = true
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




  editRoles(data) {
    // //console.log('editRoles')

   //console.log(this.authSerivce.getUserRoles().filter(item=>config.authRoles.UserManagement.includes(item.moduleName)))
    this.router.navigateByUrl("/branch-manager/edit-branches"
      , { state: { branchManagerId: data.id, branchManagerName: data.name } });
  }

  editUser(data) {
    //console.log(this.authSerivce.getUserRoles().filter(item=>config.authRoles.UserManagement.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.add).length)
if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.UserManagement.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.edit).length==0)
{
  this.snack.open('You do not have access to this page!', 'OK',{
    duration: 5000
  });
}else{
     //console.log('edit'+data.name)
    this.router.navigateByUrl("/edituser"
      , { state: { userId: data.id, name: data.name} });}
  }

  isActivate;
  checkedId;
  selectedCheckedRow(data, checked) {
    this.actionDone = false;
    this.serviceError = false

     ////console.log("select checked row...",data);
    this.checkedId = data.id;
    //console.log(checked)
    this.isActivate = checked
    //console.log(data);
    if (this.isActivate) {
      this.modalMsg = "Are you sure you want to activate this User with username: " + data.userName + "?"
      this.modalHeaderMsg = "Activate";
    } else {
      this.modalMsg = "Are you sure you want to deactivate this User with username: " + data.userName + "?"
      this.modalHeaderMsg = "Deactivate";
    }
  }

  ActivateDeactivateSelectedRow() {
    this.dataLoaded = false;
    this.actionDone = false;

    this.serviceError = false

    if (this.isActivate) {
      this.userService.activateUser(this.checkedId).subscribe(
        (response) => {
          this.dataLoaded = true;
          //after delete get new data from database 
          this.updateTable(this.start, this.pageLength, '');
          this.returnedMsg = response['englishMessage']
          this.actionDone = response['actionDone'];
          this.snack.open(this.returnedMsg, 'OK',{
            duration: 4000
          });
         // this.goToDivMsg();
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
          this.snack.open(this.errorMsg, 'Failed',{
            duration: 4000
          });
        //  this.goToDivErrorMsg();
        }
      );
    } else {
      this.userService.deactivateUser(this.checkedId).subscribe(
        (response) => {
          this.dataLoaded = true;
          //after delete get new data from database 
          this.updateTable(this.start, this.pageLength, '');
          this.returnedMsg = response['englishMessage']
          this.actionDone = response['actionDone'];
          this.snack.open(this.returnedMsg, 'OK',{
            duration: 4000
          });
          // this.goToDivMsg();
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
          this.snack.open(this.errorMsg, 'Failed',{
            duration: 4000
          });
         // this.goToDivErrorMsg();
        }
      );
    }
  }

  deleteId: any;
  selectedDeleteRow(data: any) {
    this.actionDone = false;
    this.serviceError = false

    // //console.log("select delete...");
    // //console.log(data);
    this.deleteId = data.id;
    this.modalMsg = "Are you sure you want to delete this user with username: " + data.userName + "?"
    //console.log('this.delete id ' + this.deleteId);
  }

  deleteSelectedRow() {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false


    this.userService.deleteUser(this.deleteId).subscribe(
      (response) => {
        this.dataLoaded = true;
        //after delete get new data from database 
        this.updateTable(this.start, this.pageLength, '');
        this.returnedMsg = response['englishMessage']
        this.actionDone = response['actionDone'];
        this.snack.open(this.returnedMsg, 'OK',{
          duration: 4000
        });
        //  this.goToDivMsg();
      }, (e) => {
        //console.log('error');
        //console.log(e);
        this.dataLoaded = true;
        this.serviceError = true;
        if (e['status'] == 500) {
          this.errorMsg = e.error['message']
        } else {
          this.errorMsg = 'Service not avaliable now,Try again later.'
        }
        this.snack.open(this.errorMsg, 'Failed',{
          duration: 4000
        });
       // this.goToDivErrorMsg();
      }
    );
  }

  RPData;
  selectedRPRow(data) {
    this.actionDone = false;
    this.serviceError = false

    // //console.log("select reset password row...");
    // //console.log(data);
    this.RPData = data.id;
    this.modalMsg = "Are you sure you want to reset password this branch manager with username: " + data.userName + "?"
  }

  ResetPasswordSelectedRow() {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false

    this.userService.resetBranchManagerPassword(this.RPData).subscribe(
      (response) => {
        this.dataLoaded = true;

        this.returnedMsg = "Password Reseted Successfully and sent by mail";// response['englishMessage']
        this.actionDone = response['actionDone'];
        this.goToDivMsg();
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

  resetForm() {

    // this.myGroup = new FormGroup({
    //   name: new FormControl("", [Validators.required]),
    //   username: new FormControl("", [Validators.required]),
    //   email: new FormControl("", [Validators.required, Validators.email]),
    //   mobilenumber: new FormControl("", [Validators.required, , Validators.pattern(new RegExp(/^(01)(0|1|2|5)[0-9]{8}/))]),
    //   dataModel: new FormControl([], [Validators.required]),
    //   rolesCheck: new FormControl([]),
    // });

    // this.myGroup.reset()
    // this.myGroup.controls['dataModel'].setValue([]);
    // this.myGroup.controls['rolesCheck'].setValue([]);

    this.rolesCheck = []
    this.checkBoxs.forEach((element) => {
      element.checked = false;
    });
    this.submittable = false;
    //console.log(this.rolesCheck)
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


}
