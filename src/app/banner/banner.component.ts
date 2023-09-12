import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { config } from 'src/config';
import { AuthService } from '../service/auth.service';
import { ListBannerComponent } from './list-banner/list-banner.component';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {


  @Output() transfer = new EventEmitter<boolean>();
  BannerAdded=false;
  @ViewChild(ListBannerComponent) private bannerComp: ListBannerComponent;

  add:boolean;
  view:boolean;

  constructor(private authSerivce: AuthService) {
    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.Banner.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.add).length == 0) { this.add = false; }
    else {
      this.add = true
    }
    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.Banner.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.view).length == 0) {
      this.view = false;
    }
    else {
      this.view = true;
    }
  }

  ngOnInit(): void {
  }


  onAdded(event){
    this.BannerAdded
    this.bannerComp.updateTable(this.bannerComp.start,this.bannerComp.pageLength,'')
   }


}
