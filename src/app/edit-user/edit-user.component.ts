import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { config } from 'src/config';
import { AddUserRequest } from '../Models/AddUserRequest';
import { EditUserInfo } from '../Models/EditUserInfo';
import { EditUserRoles } from '../Models/EditUserRoles';
import { Roles,Module } from '../Models/ModuleRoles';
import { AuthService } from '../service/auth.service';
import { BranchManagerService } from '../service/branch-manager.service';
import { BranchService } from '../service/branch.service';
import { UsersService } from '../service/users.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {


  @ViewChild('paginator') paginator: MatPaginator;
  // @ViewChild('CheckBoxForm') checkBoxs: MatCheckbox;

  @ViewChildren("CheckBoxForm") checkBoxs: QueryList<MatCheckbox>;
  @ViewChild('divfocus') divfocus: ElementRef;
  @ViewChild('divErrorfocus') divErrorfocus: ElementRef;

  userId;
  userName;
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
  submittableRoles = false;
  dataSource: any;
  defaultData: any;
  modalMsg;
  modalHeaderMsg;
  returnedMsg;
  //ecrmAccountNo;
  filteredmodule:Module;
  rolesList: Roles[];
  entitySpocPersonId;
  newUser:AddUserRequest;
  editUser:EditUserInfo;
  editUserRole:EditUserRoles;

  roleServiceError;
  roleActionDone;
  roleErrorMsg;
  roleReturnedMsg;

  myGroup = new FormGroup({
    name: new FormControl("", [Validators.required]),
    username: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required, Validators.email]),
    mobilenumber: new FormControl("", [Validators.required, , Validators.pattern(new RegExp(/^(01)(0|1|2|5)[0-9]{8}/))]),
    dataModel: new FormControl([], ),
    rolesCheck: new FormControl([]),
    active:new FormControl()
  });

  myGroupRoles = new FormGroup({
    dataModel: new FormControl([], ),
    rolesCheck: new FormControl([]),
    active:new FormControl()
  });

  editId;
  rolesCheck = [];
  rolesassigned=[];

Modules:any
// Module[]=[
//   {

//     id:1,
//     moduleName:'Voting',
//     roles:[{id:1,roleName:'Add'},{id:2,roleName:'Edit'}]
//   },
//   {
//     id:2,
//     moduleName:'Events',
//     roles:[{id:3,roleName:'Add'},{id:4,roleName:'Delete'}]
//   },
//   {
//     id:3,
//     moduleName:'Medical',
//     roles:[{id:5,roleName:'Add'},{id:6,roleName:'Approve'}]
//   }
// ]
//ModuleNames=this.Modules.map(item=>item.moduleName);
 userDetails:any;
  branchListOptions: any;
  config = {
    displayKey: "moduleName", //if objects array passed which key to be displayed defaults to description
    search: true, //true/false for the search functionlity defaults to false,
    height: '150px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: 'Select Module', // text to be displayed when no item is selected defaults to Select,
    customComparator: () => {
    }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    limitTo: 5,// options.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search', // label thats displayed in search input,
    // searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
  }
  actionDone: boolean = false;
  constructor(private authService: AuthService
    , private branchManagerService: BranchManagerService
    , private activatedRoute: ActivatedRoute, private route: Router,
    private userService:UsersService, private snack: MatSnackBar) {

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
// added for second form
    this.myGroupRoles.valueChanges.subscribe(res => {
      if (this.myGroupRoles.valid) {
        this.submittableRoles = true;
        //console.log(this.myGroupRoles.value)
      } else {
        this.submittableRoles = false;
      }
    });

    this.activatedRoute.paramMap.pipe(map(() => window.history.state))
      .subscribe(async (data) => {
        // //console.log('BranchComponent')
         //console.log(data);
        if (data.navigationId == 1) {
          this.route.navigateByUrl("/userlist")
        } else {
          this.userId = data.userId;
          this.userName = data.name
          //console.log(data['name']);
         // this.myGroup.get('name').setValue(this.userName);

          try {
            //call getById
            this.dataLoaded=false;
            this.Modules = await this.branchManagerService.getModulesRoleslookUp().toPromise();
//console.log(this.Modules)
            this.userDetails = await this.branchManagerService.getUserById(this.userId).toPromise()
            //console.log(this.userDetails.user)
            this.myGroup.get('name').setValue(this.userDetails.user.name);
            this.myGroup.get('username').setValue(this.userDetails.user.userName);
            this.myGroup.get('email').setValue(this.userDetails.user.mail);
            this.myGroup.get('mobilenumber').setValue(this.userDetails.user.mobileNumber);
            this.myGroup.get('active').setValue(this.userDetails.user.isActive);
            this.editId=this.userDetails.user.id;
            //console.log('editId',this.editId)
            
         this.rolesassigned=this.userDetails.usersAssignedModuleRoleByUser.map(item=>item.roles)
         //console.log('thiss',this.rolesassigned)
         for(let i of this.rolesassigned){

          for(let x of i)

          this.rolesCheck.push(x.id);
         }
         this.dataLoaded=true
         //console.log('thiss',this.rolesCheck)
          } catch (e) {
            this.dataLoaded=true
            //console.log(e)
            this.serviceError = true;
            if (e['status'] == 500) {
              this.errorMsg = e.error['message']
            } else {
              this.errorMsg = 'Service not avaliable,Try again later.'
            }
            this.goToDivErrorMsg();
          }
          //this.updateTable(this.start, this.pageLength, '', this.branchManagerId);

        }
      });
  }

  async ngOnInit() {

    if(this.authService.getUserRoles().filter(item=>config.authRoles.UserManagement.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.edit).length==0)
    {

      this.snack.open('You do not have access to this page!', 'OK',{
        duration: 5000
      });

      this.route.navigateByUrl("/home")
      
   
    }
    this.actionDone = false
    this.serviceError = false
    this.myGroupRoles.controls['rolesCheck'].setValue(this.rolesCheck);
  //  this.dataLoaded=true;
    try {
      //call getRoles
     // this.rolesList = await this.branchManagerService.branchManagerRoles().toPromise();

     // this.branchListOptions = await this.branchManagerService.allBranchesByEcrmAccount().toPromise();
      // //console.log(this.branchListOptions)
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

  selectionChanged(event){
    //console.log('drop down ',this.myGroupRoles.controls['dataModel'].value['id'])

    this.filteredmodule=this.Modules.filter(modid=>modid.id==this.myGroupRoles.controls['dataModel'].value['id'])[0]
 this.rolesList=this.filteredmodule.roles;
    //console.log(this.rolesList)

  }

  roleSelected(id){
    if(this.rolesCheck.indexOf(id)!=-1)
    {return true}
    else {
    return false}
   }
  updateSome(event) {
    //console.log(event.checked)
    if (event.checked) {

      this.rolesCheck.push(parseInt(event.source.name))
    } else {
      // //console.log('not checked')

      this.rolesCheck.splice(this.rolesCheck.indexOf(parseInt(event.source.name)), 1);
    }
    // //console.log(this.rolesCheck)
    this.myGroupRoles.controls['rolesCheck'].setValue(this.rolesCheck);

    //console.log(this.rolesCheck);
  }


 
  
 

  addNewUser() {

    this.dataLoaded = false;
    this.serviceError = false;
    this.actionDone = false;
     this.newUser = {
      mail: this.myGroup.get('email').value,
      mobileNumber: this.myGroup.get('mobilenumber').value,
      name: this.myGroup.get('name').value,
      userName: this.myGroup.get('username').value,
      isActive:this.myGroup.get('active').value,
      isDeleted:false,
      userAssignedModuleRole: this.myGroup.controls['rolesCheck'].value
    }

    //console.log(this.newUser);

    this.branchManagerService.addNewUser(this.newUser).subscribe(
      res => {
        //console.log(res)
        this.dataLoaded = true;
        this.returnedMsg = res['englishMessage']
        this.actionDone = res['actionDone'];
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

  editUserInfo() {

    this.dataLoaded = false;
    this.serviceError = false;
    this.actionDone = false;
     this.editUser = {
      id:this.editId, 
      mail: this.myGroup.get('email').value,
      mobileNumber: this.myGroup.get('mobilenumber').value,
      name: this.myGroup.get('name').value,
      userName: this.myGroup.get('username').value,
      isActive:this.myGroup.get('active').value,
      isDeleted:false
    }

    //console.log(this.editUser);

    this.userService.editUserInfo(this.editUser).subscribe(
      res => {
        //console.log(res)
        this.dataLoaded = true;
        this.returnedMsg = res['englishMessage']
        this.actionDone = res['actionDone'];
        //this.resetForm();
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



  editUserRoles() {

    this.dataLoaded = false;
    this.roleServiceError = false;
    this.roleActionDone = false;
     this.editUserRole = {
       id:this.editId, 
       userAssignedModuleRole: this.rolesCheck,

    }

    //console.log(this.editUserRole);

    this.userService.editUserRoles(this.editUserRole).subscribe(
      res => {
        //console.log(res)
        this.dataLoaded = true;
        this.roleReturnedMsg = res['englishMessage']
        this.roleActionDone = res['actionDone'];
        //this.resetForm();
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



  editRoles(data) {
    // //console.log('editRoles')
    this.route.navigateByUrl("/branch-manager/edit-branches"
      , { state: { branchManagerId: data.id, branchManagerName: data.name } });
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

    this.myGroup.reset()
    //this.myGroup.controls['dataModel'].setValue([]);
    //this.myGroup.controls['rolesCheck'].setValue([]);

    // this.rolesCheck = []
    // this.checkBoxs.forEach((element) => {
    //   element.checked = false;
    // });
    // this.submittable = false;
    // //console.log(this.rolesCheck)
  }

  resetFormRoles() {


    //this.myGroup.reset()
    //this.myGroup.controls['dataModel'].setValue([]);
    //this.myGroup.controls['rolesCheck'].setValue([]);

    this.rolesCheck = []
    this.checkBoxs.forEach((element) => {
      element.checked = false;
    });
    this.submittable = false;
    //console.log(this.rolesCheck)
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

}

