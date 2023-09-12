import { Component, OnInit, ViewChild } from '@angular/core';
import { AllMedicalFilesComponent } from './all-medical-files/all-medical-files.component';

@Component({
  selector: 'app-medical-page',
  templateUrl: './medical-page.component.html',
  styleUrls: ['./medical-page.component.css']
})
export class MedicalPageComponent implements OnInit {
  sheetAdded=false;
  @ViewChild(AllMedicalFilesComponent) private medicalComp: AllMedicalFilesComponent;
  constructor() { }

  ngOnInit(): void {
  }
  onAdded(event){
    this.medicalComp.updateTable(this.medicalComp.start,this.medicalComp.pageLength,'')
   }
}
