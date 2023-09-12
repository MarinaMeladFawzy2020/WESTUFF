import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { config } from 'src/config';
import { AuthService } from '../service/auth.service';
import { QuestionsListComponent } from './questionnaire-list/questionnaire-list.component';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {


  add:boolean;
view:boolean;
viewstat:boolean;

@Output() transfer = new EventEmitter<boolean>();


QuestionAdded=false;
@ViewChild(QuestionsListComponent) private quesComp: QuestionsListComponent;
  constructor(private authSerivce: AuthService) {
    if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.Questionaire.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.add).length==0)
      {  this.add=false;}
        else
        {
        this.add=true
        }
        if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.Questionaire.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.view).length==0)
  {this.view=false;
  }
  else
{  this.view=true;
}
if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.Questionaire.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.viewStatistics).length==0)
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
    this.QuestionAdded
    this.quesComp.updateTable(this.quesComp.start,this.quesComp.pageLength,'')
   }


   
}
