import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { config } from 'src/config';
import { ListCorrespondenceComponent } from './list-correspondence/list-correspondence.component';

@Component({
  selector: 'app-correspondence',
  templateUrl: './correspondence.component.html',
  styleUrls: ['./correspondence.component.css']
})
export class CorrespondenceComponent implements OnInit {

  @ViewChild(ListCorrespondenceComponent) private correspondenceComp: ListCorrespondenceComponent;


  correspondenceAdded = false
  add:boolean;
  view:boolean;
  selectedCorrespondenceCat = []

  constructor(private authSerivce: AuthService) {
    
    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.Correspondence.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.add).length == 0) { this.add = false; }
    else {
      this.add = true
    }
    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.Correspondence.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.view).length == 0) {
      this.view = false;
    }
    else {
      this.view = true;
    }

   }

  ngOnInit(): void {
  }

  onAdded(event){
    this.correspondenceAdded
    this.correspondenceComp.updateTable(this.correspondenceComp.start,this.correspondenceComp.pageLength,'',this.selectedCorrespondenceCat)
   }

}
