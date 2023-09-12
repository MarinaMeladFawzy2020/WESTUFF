import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ComplaintsService } from 'src/app/service/complaints.service';

@Component({
  selector: 'app-complaint-edit',
  templateUrl: './complaint-edit.component.html',
  styleUrls: ['./complaint-edit.component.css']
})
export class ComplaintEditComponent implements OnInit {
  [x:string]:any;
  mainData : any = {};
  constructor(private activatedRoute:ActivatedRoute , private route: Router , private dataApi:ComplaintsService) {
    console.log(this.activatedRoute.paramMap)
    console.log(window.history.state)
    this.activatedRoute.paramMap.pipe(map(() => window.history.state))
    .subscribe(async (data) => {
      console.log(data)
      if (data.complaintId == 1) {
        this.route.navigateByUrl("/complaints")
      } else {
        // this.complaintId = data.complaintId;
        this.complaintId = sessionStorage.getItem('complaintId');
        this.getMainDataByID(this.complaintId)

      }


  });
  }

  ngOnInit(): void {
  }

  getMainDataByID(id){
    this.dataApi.getComplaintByID(id).subscribe(
      (res:any) => {
        console.log(res);
        this.mainData = res
        this.dataLoaded = true;


      }, e => {
        console.log(e)
        this.dataLoaded = true;
      }

    )
  }
}
