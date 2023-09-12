import { animate, state, style, transition, trigger } from '@angular/animations';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { VotingDetails } from 'src/app/Models/VotingDetails';
import { QuestionnaireService } from 'src/app/service/Questionnaire.service';
import { VotingService } from 'src/app/service/voting.service';

@Component({
  selector: 'app-votings-list-statistics',
  templateUrl: './votings-list-statistics.component.html',
  styleUrls: ['./votings-list-statistics.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class VotingsListStatisticsComponent implements OnInit {

  pageLength = 1;
  dataLength: number;
  start = 0;
  end: number;
  filterStart = 0;
  filterSize = 5;
  isFilter = false;
  filterArray;
  dataSource= new MatTableDataSource();
  defaultData: any;
  serviceError = false;
  dataLoaded:boolean=false;
  isTableExpanded = false;
  returnedMsg;
  actionDone: boolean = false;
  votingId:number
  errorMsg;

  votingDetails:VotingDetails;

  isExpanded=false;

  allvotings:any[]=[]
  @ViewChild('paginator') paginator: MatPaginator;

  @ViewChild('divfocus') divfocus: ElementRef;
  @ViewChild('divErrorfocus') divErrorfocus: ElementRef;

  constructor(private router: Router,private service:VotingService,private activatedRoute: ActivatedRoute,private route: Router){



    this.activatedRoute.paramMap.pipe(map(() => window.history.state))
    .subscribe(async (data) => {
      // //console.log('BranchComponent')
       //console.log(data);
      if (data.navigationId == 1) {
        this.route.navigateByUrl("/voting")
      } else {
        this.votingId = data.votingId;
        //console.log(data['name']);

       

      }

    
  });


  }
  

  dataStudentsList = new MatTableDataSource();
  displayedquestionsColumnsList: string[] = ['order', 'title', 'description', 'actions'];


  ngOnInit() {
    this.updateTable(this.start, this.pageLength, '');

//    this.dataStudentsList.data = this.STUDENTS_DATA;
  }

  // Toggel Rows
  toggleTableRows() {
    this.isTableExpanded = !this.isTableExpanded;

    this.dataSource.data.forEach((row: any) => {
      row.isExpanded = this.isTableExpanded;
    })
  }
  updateTable(start, limit, searchText) {
    this.dataLoaded = false;
    this.actionDone = false;
    this.serviceError = false

    //console.log('get all voting ')
    //call service getBranchManagersList
    this.service.getVotingStatisticsWithAnswers(this.votingId).subscribe(
      res => {
        //console.log(res)
        this.dataLength = 1;
this.allvotings.push(res);
       // this.votingDetails = res;
        this.dataSource.data=this.allvotings;
        this.dataSource.data.forEach((row: any) => {
          row.isExpanded = this.isTableExpanded;
        })
        //console.log(this.dataSource.data)
        this.defaultData = res;
        this.dataLoaded = true;
        this.filterArray = new MatTableDataSource(this.defaultData);
      }, e => {
        //console.log(e)
        this.dataLoaded = true;
        this.serviceError = true;
        if (e['status'] == 500) {
          this.errorMsg = e.error['message']
        } else {
          this.errorMsg = 'Service not avaliable,Try again later.'
        }
        this.goToDivErrorMsg();
      }
    )
  }
  goToDivMsg() {
    setTimeout(() => {
      // //console.log(this.divfocus.nativeElement)
      this.divfocus.nativeElement.scrollIntoView();

    }, 0);
  }
  goToDivErrorMsg() {
    setTimeout(() => {
      // //console.log(this.divfocus.nativeElement)
      this.divErrorfocus.nativeElement.scrollIntoView();

    }, 0);
  }

  filterText;
  updatePage(event) {
    this.actionDone = false
    this.serviceError = false

    // //console.log('isFilter ' + this.isFilter)

    if (!this.isFilter) {
      this.filterStart = 0;

      this.start = event.pageIndex;
      this.end = this.pageLength;
      // //console.log('start ' + this.start + ' limit ' + this.pageLength)
      this.updateTable(this.start, this.end, '');
    } else {
      this.start = 0

      this.filterStart = event.pageIndex;
      this.end = this.filterSize;
      // //console.log('start ' + this.filterStart + ' limit ' + this.filterSize)
      this.updateTable(this.filterStart, this.pageLength, this.filterText);
    }
  }

  applyFilter(event) {

    this.actionDone = false
    this.serviceError = false
    this.serviceError = false

    var filterValue = event.target.value
    var keyPress = event.key
    //console.log('applyFilter ' + filterValue.trim().toLowerCase())
    this.filterText = filterValue.trim().toLowerCase();

    if (keyPress === "Enter") {

      this.paginator.pageIndex = 0;
      this.filterStart = 0;
      this.isFilter = true
      this.updateTable(this.filterStart, this.pageLength, this.filterText);
    }
    if (!this.filterText) {

      // //console.log('no filter')
      this.paginator.pageIndex = 0;
      this.start = 0;
      this.isFilter = false;
      this.updateTable(this.start, this.pageLength, '');
    }
  }

// changeExpansion()
// {
// if(this.isExpanded==false)
// this.isExpanded=true;
// else
// this.isExpanded=false;

// }
viewfeedbacks(id){
this.router.navigateByUrl("/questionstatisticsfeedback"
, { state: { questionId: id} });}
}

