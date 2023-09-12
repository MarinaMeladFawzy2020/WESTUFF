import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { config } from 'src/config';
import { AuthService } from '../service/auth.service';
import { ListMedicalTopicCategoryComponent } from './list-medical-topic-category/list-medical-topic-category.component';

@Component({
  selector: 'app-medical-topic-category',
  templateUrl: './medical-topic-category.component.html',
  styleUrls: ['./medical-topic-category.component.css']
})
export class MedicalTopicCategoryComponent implements OnInit {

  @Output() transfer = new EventEmitter<boolean>();
  OfferCategoryAdded=false;
  @ViewChild(ListMedicalTopicCategoryComponent) private offerCatComp: ListMedicalTopicCategoryComponent;

  add:boolean;
  view:boolean;

  constructor(private authSerivce: AuthService) {

    if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.Medical.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.addTopic).length==0)
      {  this.add=false;}
        else
        {
        this.add=true
        }
  if(this.authSerivce.getUserRoles().filter(item=>config.authRoles.Medical.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.viewTopic).length==0)
  {
    this.view=false;
  }
  else
{
    this.view=true;
     }


    }


  ngOnInit(): void {
  }

  onAdded(event){
    this.OfferCategoryAdded
    this.offerCatComp.updateTable(this.offerCatComp.start,this.offerCatComp.pageLength,'')
   }

}
