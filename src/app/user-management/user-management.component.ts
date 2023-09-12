import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { config } from 'src/config';
import { BranchComponent } from '../branch/branch.component';
import { AuthService } from '../service/auth.service';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
add:boolean;
view:boolean;
userAdded=false;
@Output() transfer = new EventEmitter<boolean>();
@ViewChild(UserListComponent) private userComp: UserListComponent;
  constructor(private authSerivce: AuthService) {
    if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.UserManagement.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.add).length==0)
      {  this.add=false;}
        else
        {
        this.add=true
        }
        if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.UserManagement.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.view).length==0)
  {this.view=false;
  }
  else
{  this.view=true;
}

        
  }

  ngOnInit(): void {
    //console.log()

  }

  onAdded(event){
   this.userAdded
   this.userComp.updateTable(this.userComp.start,this.userComp.pageLength,'')
  }

  

}
