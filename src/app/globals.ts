import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class Globals {
  lang: string = '';
  navScrolled:boolean=false;
  // globalHomeData: any;
  
  
  constructor( public route: ActivatedRoute,private router: Router) {
  }
}