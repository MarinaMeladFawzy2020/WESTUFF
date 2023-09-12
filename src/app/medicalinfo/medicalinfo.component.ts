import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { config } from 'src/config';
import { MedicalinfoListComponent } from './medicalinfo-list/medicalinfo-list.component';

@Component({
  selector: 'app-medicalinfo',
  templateUrl: './medicalinfo.component.html',
  styleUrls: ['./medicalinfo.component.css']
})
export class MedicalinfoComponent implements OnInit {

  add:boolean;
  view:boolean;

  @Output() transfer = new EventEmitter<boolean>();
  MedicalInfoAdded=false;
  @ViewChild(MedicalinfoListComponent) private medicalComp: MedicalinfoListComponent;

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
    this.MedicalInfoAdded
    this.medicalComp.updateTable(this.medicalComp.start,this.medicalComp.pageLength,'')
   }


}
