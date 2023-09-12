import { Component, OnInit, ViewChild } from '@angular/core';
import { config } from 'src/config';
import { AuthService } from '../service/auth.service';
import { ListNewsCategoryComponent } from './list-news-category/list-news-category.component';

@Component({
  selector: 'app-news-category',
  templateUrl: './news-category.component.html',
  styleUrls: ['./news-category.component.css']
})
export class NewsCategoryComponent implements OnInit {

  NewsCategoryAdded=false;
  
  @ViewChild(ListNewsCategoryComponent) private newsCatComp: ListNewsCategoryComponent;

  add:boolean;
  view:boolean;

  constructor(private authSerivce: AuthService) {
    if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.News.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.add).length==0)
    {  this.add=false;}
      else
      {
      this.add=true
      }
      if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.News.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.view).length==0)
{this.view=false;
}
else
{  this.view=true;
}


 }
 
  ngOnInit(): void {
  }

  onAdded(event){
    this.NewsCategoryAdded
    this.newsCatComp.updateTable(this.newsCatComp.start,this.newsCatComp.pageLength,'')
   }
}



