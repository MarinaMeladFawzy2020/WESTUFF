import { Component, OnInit, ViewChild } from '@angular/core';
import { config } from 'src/config';
import { ListCorrespondenceComponent } from '../correspondence/list-correspondence/list-correspondence.component';
import { AuthService } from '../service/auth.service';
import { ListCorrespondenceCategoryComponent } from './list-correspondence-category/list-correspondence-category.component';

@Component({
  selector: 'app-correspondence-category',
  templateUrl: './correspondence-category.component.html',
  styleUrls: ['./correspondence-category.component.css']
})
export class CorrespondenceCategoryComponent implements OnInit {

  correspondenceCategoryAdded=false;
  
  @ViewChild(ListCorrespondenceCategoryComponent) private correspondenceCatComp: ListCorrespondenceCategoryComponent;

  add:boolean;
  view:boolean;

  constructor(private authSerivce: AuthService) {
    if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.Correspondence.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.add).length==0)
    {  this.add=false;}
      else
      {
      this.add=true
      }
      if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.Correspondence.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.view).length==0)
{this.view=false;
}
else
{  this.view=true;
}


 }

  ngOnInit(): void {
  }

  onAdded(event){
    this.correspondenceCategoryAdded
    this.correspondenceCatComp.updateTable(this.correspondenceCatComp.start,this.correspondenceCatComp.pageLength,'')
   }

}
