import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { config } from 'src/config';
import { AuthService } from '../service/auth.service';
import { ListTopicComponent } from './list-topic/list-topic.component';

@Component({
  selector: 'app-notification-topic',
  templateUrl: './notification-topic.component.html',
  styleUrls: ['./notification-topic.component.css']
})
export class NotificationTopicComponent implements OnInit {

  @Output() transfer = new EventEmitter<boolean>();
  TopicAdded=false;
  add:boolean;
  view:boolean;
  @ViewChild(ListTopicComponent) private topicComp: ListTopicComponent;


  constructor(private authSerivce: AuthService) {


    if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.NotificationTopic.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.addTopic).length==0)
      {  this.add=false;}
        else
        {
        this.add=true
        }
        if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.NotificationTopic.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.viewTopic).length==0)
  {this.view=false;
  }
  else
{  this.view=true;
}


   }

  ngOnInit(): void {
  }


  onAdded(event){
    this.TopicAdded
    this.topicComp.updateTable(this.topicComp.start,this.topicComp.pageLength,'')
   }


}
