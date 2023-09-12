import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { config } from 'src/config';
import { AuthService } from '../service/auth.service';
import { ListOfferCategoryComponent } from './list-offer-category/list-offer-category.component';

@Component({
  selector: 'app-offer-category',
  templateUrl: './offer-category.component.html',
  styleUrls: ['./offer-category.component.css']
})
export class OfferCategoryComponent implements OnInit {

  @Output() transfer = new EventEmitter<boolean>();
  OfferCategoryAdded=false;
  @ViewChild(ListOfferCategoryComponent) private offerCatComp: ListOfferCategoryComponent;

  add:boolean;
  view:boolean;


  constructor(private authSerivce: AuthService) { 

    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.Benefit.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.add).length == 0) { this.add = false; }
    else {
      this.add = true
    }
    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.Benefit.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.view).length == 0) {
      this.view = false;
    }
    else {
      this.view = true;
    }
  }

  ngOnInit(): void {
  }

  
  onAdded(event){
    this.OfferCategoryAdded
    this.offerCatComp.updateTable(this.offerCatComp.start,this.offerCatComp.pageLength,'')
   }


}
