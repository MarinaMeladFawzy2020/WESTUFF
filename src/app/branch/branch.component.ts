import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { BranchManagerService } from '../service/branch-manager.service';
import { BranchService } from '../service/branch.service';
import { AuthService } from '../service/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {

  // @ViewChild('C') checkBoxs: MatCheckbox;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('openModalButton') openModalButton: ElementRef;
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('divfocus') divfocus: ElementRef;
  @ViewChild('divErrorfocus') divErrorfocus: ElementRef;
  @ViewChildren("C") checkBoxs: QueryList<MatCheckbox>;
  pageLength = 5;
  dataLength: number;
  start = 0;
  end: number;
  filterStart = 0;
  filterSize = 5;
  isFilter = false;

  branchManagerName;
  branchManagerId;
  rolesList: any;
  branchListOptions
  serviceError = false;
  errorMsg;
  ecrmAccountNo;
  entitySpocPersonId;
  submittable = false;
  rolesCheck = [];
  actionDone: boolean = false;
  pageEvent: PageEvent;
  filterArray;
  sortedData = [];
  dataLoaded = false;
  dataSource: any;
  defaultData: any;
  modalMsg;
  modalHeaderMsg;
  returnedMsg;
  errorUpdateRoles;
  msgUpdateRoles
  updateRoles = true;
  assignedRolesList;
  updatedRolesList = []
  showModalBox = false;

  myGroup = new FormGroup({
    dataModel: new FormControl([], [Validators.required]),
    rolesCheck: new FormControl([]),
  });

  config = {
    displayKey: "BranchName", //if objects array passed which key to be displayed defaults to description
    search: true, //true/false for the search functionlity defaults to false,
    height: '150px', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: 'Select Branch', // text to be displayed when no item is selected defaults to Select,
    customComparator: () => {
    }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    limitTo: 5,// options.length, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder: 'Search', // label thats displayed in search input,
    // searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
  }
  branchName: any;
  branchId: any;

  constructor(private activatedRoute: ActivatedRoute, private route: Router,
    private branchManagerService: BranchManagerService
    , private branchService: BranchService, private authService: AuthService) {

    // this.ecrmAccountNo = authService.currentUser.ECRMAssociatedAccountNo
    // this.entitySpocPersonId = authService.currentUser.EntitySpocPersonId
    this.myGroup.valueChanges.subscribe(res => {
      if (this.myGroup.valid) {
        this.submittable = true;
        //console.log(this.myGroup.value)
      } else {
        this.submittable = false;
      }
    });
    this.activatedRoute.paramMap.pipe(map(() => window.history.state))
      .subscribe(async (data) => {
        // //console.log('BranchComponent')
        // //console.log(data);
        if (data.navigationId == 1) {
          this.route.navigateByUrl("/branch-manager")
        } else {
          this.branchManagerId = data.branchManagerId;
          this.branchManagerName = data.branchManagerName

          try {
            //call getRoles
           // this.rolesList = await this.branchManagerService.branchManagerRoles().toPromise();

            this.branchListOptions = await this.branchManagerService.allBranchesByEcrmAccount().toPromise();
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
          this.updateTable(this.start, this.pageLength, '', this.branchManagerId);

        }
      });
  }

  ngOnInit(): void {
  }

  updateSome(event) {
    //console.log(event.checked)
    if (event.checked) {

      this.rolesCheck.push(parseInt(event.source.name))
    } else {

      this.rolesCheck.splice(this.rolesCheck.indexOf(parseInt(event.source.name)), 1);
    }
    // //console.log(this.rolesCheck)
    this.myGroup.controls['rolesCheck'].setValue(this.rolesCheck);

  }

  getBranchRoles(data) {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false
    this.showModalBox = false;
    this.updatedRolesList = [];
    //console.log(data)
    this.branchName = data.branchName;
    this.branchId = data.branchId;
    //call serive 
    this.branchService.branchManagerAssignedBranchesRoles(data.id).subscribe(
      res => {

        this.assignedRolesList = res;
        this.dataLoaded = true;
        //console.log(res)

        this.assignedRolesList.forEach(r => {
          if (r.flag) {
            this.updatedRolesList.push(r.id)
          }

        });
        this.openModalButton.nativeElement.click();
      }, e => {
        //console.log(e)
        this.dataLoaded = true;
        this.serviceError = true;

        // //console.log(this.updatedRolesList)
        if (e['status'] == 500) {
          this.errorMsg = e.error['message']
        } else {
          this.errorMsg = 'Service not avaliable,Try again later.'
        }
        this.goToDivErrorMsg();
      }
    )


  }
  updateBranchRoles() {
    // //console.log(this.branchName + ' ' + this.branchId)
    this.updateRoles = false;

    this.branchService.updateBranchManagerRoles(this.branchManagerId, this.branchId, this.updatedRolesList).subscribe(
      res => {
        //console.log(res)
        this.updateRoles = true;
        this.closeModal.nativeElement.click();
        this.updateTable(this.start, this.pageLength, '', this.branchManagerId);
      }, e => {
        this.updateRoles = true;

        this.errorUpdateRoles = true;
        if (e['status'] == 500) {
          this.msgUpdateRoles = e.error['message']
        } else {
          this.msgUpdateRoles = 'Service not avaliable,Try again later.'
        }
        this.goToDivErrorMsg();
      }
    )
  }

  updateAssignedRoles(event) {

    if (event.checked) {

      this.updatedRolesList.push(parseInt(event.source.name))
    } else {

      this.updatedRolesList.splice(this.updatedRolesList.indexOf(parseInt(event.source.name)), 1);
    }
    // //console.log(this.updatedRolesList)
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
      this.updateTable(this.start, this.pageLength, '', this.branchManagerId);
    } else {
      this.start = 0

      this.filterStart = event.pageIndex;
      this.end = this.filterSize;
      // //console.log('start ' + this.filterStart + ' limit ' + this.filterSize)
      this.updateTable(this.filterStart, this.pageLength, this.filterText, this.branchManagerId);
    }
  }

  updateTable(start, limit, searchText, branchManagerId) {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false

    // //console.log('GetBranchManagerAssignedBranches')
    //call service GetBranchManagerAssignedBranches
    this.branchService.GetBranchManagerAssignedBranches(start, limit, searchText, branchManagerId).subscribe(
      res => {
        //console.log(res)
        this.dataLength = res['totalCount'];
        this.dataSource = res['branchDetails'];

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
    // //console.log('applyFilter ' + filterValue.trim().toLowerCase())
    this.filterText = filterValue.trim().toLowerCase();

    if (keyPress === "Enter") {

      this.paginator.pageIndex = 0;
      this.filterStart = 0;
      this.isFilter = true
      this.updateTable(this.filterStart, this.pageLength, this.filterText, this.branchManagerId);
    }
    if (!this.filterText) {

      // //console.log('no filter')
      this.paginator.pageIndex = 0;
      this.start = 0;
      this.isFilter = false;
      this.updateTable(this.start, this.pageLength, '', this.branchManagerId);
    }
  }

  assignManagerToBranch() {
    this.dataLoaded = false;
    this.serviceError = false;
    var branchId = this.myGroup.get('dataModel').value.BranchID;
    var assignedRoles = this.myGroup.controls['rolesCheck'].value
    //console.log({ 'branchId': branchId, 'assignedRoles': assignedRoles })


    this.branchService.assignManagerToBranch(this.branchManagerId, branchId, assignedRoles).subscribe(
      res => {
        //console.log(res)
        this.dataLoaded = true;

        this.updateTable(this.start, this.pageLength, '', this.branchManagerId)
        this.returnedMsg = res['englishMessage']
        this.actionDone = res['actionDone'];
        //console.log(this.returnedMsg)
        //console.log(this.actionDone)
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


  deleteId: any;
  selectedDeleteRow(data: any) {
    this.actionDone = false;
    this.serviceError = false

    this.deleteId = data.branchId;
    this.modalMsg = "Are you sure you want to delete this branch : " + data.branchName + "?"
    //console.log('this.delete id ' + this.deleteId);
  }

  deleteSelectedRow() {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false


    this.branchService.unassignBranchFromBranchManager(this.branchManagerId, this.deleteId).subscribe(
      (response) => {
        this.dataLoaded = true;
        //after delete get new data from database 
        this.updateTable(this.start, this.pageLength, '', this.branchManagerId);
        this.returnedMsg = response['englishMessage']
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
    // this.branchListOptions = []

    // this.checkBoxs.checked = false;

    // this.myGroup = new FormGroup({
    //   dataModel: new FormControl([], [Validators.required]),
    //   rolesCheck: new FormControl([], [Validators.required]),
    // });
    this.myGroup.reset()
    this.myGroup.controls['dataModel'].setValue([]);
    this.myGroup.controls['rolesCheck'].setValue([]);
    this.checkBoxs.forEach((element) => {
      element.checked = false;
    });

    this.rolesCheck = []
    this.submittable = false;
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
