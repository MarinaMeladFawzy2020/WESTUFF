import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { config } from 'src/config';
import { AuthService } from '../service/auth.service';
import { NewsListComponent } from './news-list/news-list.component';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  @Output() transfer = new EventEmitter<boolean>();
  newsAdded=false;
  @ViewChild(NewsListComponent) private newsComp: NewsListComponent;

  add:boolean;
  view:boolean;


  constructor(private authSerivce: AuthService) { 

    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.News.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.add).length == 0) { this.add = false; }
    else {
      this.add = true
    }
    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.News.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.view).length == 0) {
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
    this.newsComp.updateTable(this.newsComp.start,this.newsComp.pageLength,'',[])
   }



}
