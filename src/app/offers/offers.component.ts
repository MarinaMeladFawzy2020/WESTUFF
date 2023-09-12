import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { config } from 'src/config';
import { AuthService } from '../service/auth.service';
import { ListOfferComponent } from './list-offer/list-offer.component';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

  @Output() transfer = new EventEmitter<boolean>();
  OfferAdded=false;
  @ViewChild(ListOfferComponent) private offerComp: ListOfferComponent;

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
    this.OfferAdded
    this.offerComp.updateTable(this.offerComp.start,this.offerComp.pageLength,'',false,[])
   }



}
