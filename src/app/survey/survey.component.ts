import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { config } from 'src/config';
import { AuthService } from '../service/auth.service';
import { SurveyListComponent } from './survey-list/survey-list.component';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  add:boolean;
  view:boolean;
  viewstat:boolean;
  
  @Output() transfer = new EventEmitter<boolean>();
  
  @ViewChild(SurveyListComponent) private surveyComp: SurveyListComponent;
  
  SurveyAdded=false;

  constructor(private authSerivce: AuthService) {
    if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.Survey.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.add).length==0)
      {  this.add=false;}
        else
        {
        this.add=true
        }
        if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.Survey.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.view).length==0)
  {this.view=false;
  }
  else
{  this.view=true;
}
if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.Survey.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.viewStatistics).length==0)
  {this.viewstat=false;
  }
  else
{  this.viewstat=true;
}
//console.log('stat ',this.viewstat)
    
  }

  ngOnInit(): void {
  }
  onAdded(event){
    this.SurveyAdded
    this.surveyComp.updateTable(this.surveyComp.start,this.surveyComp.pageLength,'')
   }


   
}

