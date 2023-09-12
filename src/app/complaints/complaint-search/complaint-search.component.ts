import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-complaint-search',
  templateUrl: './complaint-search.component.html',
  styleUrls: ['./complaint-search.component.css']
})
export class ComplaintSearchComponent implements OnInit {
  submitLoaded : boolean = false;
  searchForm = new FormGroup({
    id: new FormControl(''),
    statusId: new FormControl(''), //[Validators.required]
    CategoryId: new FormControl(''),
    SubCategoryId: new FormControl(''),
    dateFrom: new FormControl(''),
    dateTo: new FormControl(''),
  });
  @Output() getResponse = new EventEmitter;

  constructor( private authSerivce: AuthService) { }
  [x:string]:any;
  ngOnInit(): void {

  }

  searchSubmit(){
    console.log(this.searchForm.value);
    this.getResponse.emit(this.searchForm.value);
  }

  reset(){
    this.searchForm.reset();
    this.getResponse.emit({});

  }

}
