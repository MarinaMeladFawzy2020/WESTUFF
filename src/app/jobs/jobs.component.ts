import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { config } from 'src/config';
import { AuthService } from '../service/auth.service';
import { ListJobsComponent } from './list-jobs/list-jobs.component';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {

  @Output() transfer = new EventEmitter<boolean>();
  newsAdded=false;
  @ViewChild(ListJobsComponent) private jobsComp: ListJobsComponent;

  add:boolean;
  view:boolean;

 
  constructor(private authSerivce: AuthService) { 

    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.Jobs.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.add).length == 0) { this.add = false; }
    else {
      this.add = true
    }
    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.Jobs.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.view).length == 0) {
      this.view = false;
    }
    else {
      this.view = true;
    }

  }

  ngOnInit(): void {
  }

  onAdded(event){
    this.newsAdded
    this.jobsComp.updateTable(this.jobsComp.start,this.jobsComp.pageLength,'')
   }



}
