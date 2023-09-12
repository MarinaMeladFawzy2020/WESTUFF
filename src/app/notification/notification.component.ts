import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { config } from 'src/config';
import { SendNotificationComponent } from './send-notification/send-notification.component';
import { NotificationListComponent } from './notification-list/notification-list.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  add:boolean;
view:boolean;
@Output() transfer = new EventEmitter<boolean>();

notiAdded=false;
@ViewChild(NotificationListComponent) private notiComp: NotificationListComponent;
  constructor(private authSerivce: AuthService) {
    if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.Notification.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.send).length==0)
      {  this.add=false;}
        else
        {
        this.add=true
        }
        if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.Notification.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.view).length==0)
  {this.view=false;
  }
  else
{  this.view=true;
}

// if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.Notification.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.viewTopic).length==0)
// {  this.add=false;}
//   else
//   {
//   this.add=true
//   }
        
  }

  ngOnInit(): void {
  }
  onAdded(event){
    this.notiAdded
    this.notiComp.updateTable(this.notiComp.start,this.notiComp.pageLength,'',this.notiComp.selected)
   }
}
