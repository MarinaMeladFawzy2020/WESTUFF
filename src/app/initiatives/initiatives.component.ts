import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { config } from 'src/config';
import { AuthService } from '../service/auth.service';
import { ListInitiativesComponent } from './list-initiatives/list-initiatives.component';

@Component({
  selector: 'app-initiatives',
  templateUrl: './initiatives.component.html',
  styleUrls: ['./initiatives.component.css']
})
export class InitiativesComponent implements OnInit {

  @Output() transfer = new EventEmitter<boolean>();
  newsAdded=false;
  @ViewChild(ListInitiativesComponent) private IntiativesComp: ListInitiativesComponent;

  add:boolean;
  view:boolean;

 
  constructor(private authSerivce: AuthService) { 

    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.Initiatives.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.add).length == 0) { this.add = false; }
    else {
      this.add = true
    }
    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.Initiatives.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.view).length == 0) {
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
    this.IntiativesComp.updateTable(this.IntiativesComp.start,this.IntiativesComp.pageLength,'')
   }



}
