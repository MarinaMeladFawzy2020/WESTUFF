import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { CountBoxes, CustomerGraph, NotificationsGraph, QuestionnaireGraph, VotingGraph } from '../Models/StatisticsResponse';
import { HomeService } from '../service/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  dataLoaded = true;
  errorMsg;
  statisticsResponse : any;
  countBoxes: CountBoxes[];

  notificationsGraph: NotificationsGraph[];
  notificationMonths: string[] =[];
  notificationData : number[] =[];

  questionnaireGraph: QuestionnaireGraph[];
  questionnaireMonths: string[] =[];
  questionnaireData: number[] =[];
  questionnaireTotalCountData: number[] =[];

  votingGraph: VotingGraph[];
  votingMonths: string[] =[];
  votingeData: number[] =[];
  votingTotalCountData: number[] =[];

  surveyGraph: VotingGraph[];
  surveyMonths: string[] =[];
  surveyData: number[] =[];
  surveyTotalCountData: number[] =[];

  customerGraph: CustomerGraph[];
  customerMonths: string[] =[];
  customerData: number[] =[];

  notificationsChart: any;
  questionnaireChart: any;
  votingChart: any;
  surveyChart: any;
  customerChart: any;

  constructor(private homeService: HomeService) { 
  }

  ngOnInit(){
    this.getStatisticsInof();
  }

  getStatisticsInof(){
      this.dataLoaded = false;
      this.statisticsResponse = this.homeService.getStatisticsData().subscribe(
        res =>{
          this.statisticsResponse = res['data'];
          this.countBoxes = this.statisticsResponse[0].CountBoxes;

          this.questionnaireGraph = this.statisticsResponse[0].QuestionnaireGraph;
          this.questionnaireGraph.forEach(element =>{
            this.questionnaireMonths.push(element.Monthtext);
            this.questionnaireData.push(element.count);
            this.questionnaireTotalCountData.push(element.TotalParticipants);
          })

          this.votingGraph = this.statisticsResponse[0].VotingGraph;
          //console.log('this.votingGraph = ', this.votingGraph)
          this.votingGraph.forEach(element =>{
            this.votingMonths.push(element.Monthtext);
            this.votingeData.push(element.count);
            this.votingTotalCountData.push(element.TotalParticipants);
          })

          this.surveyGraph = this.statisticsResponse[0].SurveyGraph;
          //console.log('this.surveyGraph = ', this.surveyGraph)
          this.surveyGraph.forEach(element =>{
            this.surveyMonths.push(element.Monthtext);
            this.surveyData.push(element.count);
            this.surveyTotalCountData.push(element.TotalParticipants);
          })

          this.customerGraph = this.statisticsResponse[0].CustomerGraph;
          this.customerGraph.forEach(element =>{
            this.customerMonths.push(element.Monthtext)
            this.customerData.push(element.count);
          })

          this.notificationsGraph = this.statisticsResponse[0].NotificationsGraph;
          this.notificationsGraph.forEach(element => {
            this.notificationMonths.push(element.Monthtext);
            this.notificationData.push(element.count);
          });
          
          // start notification-chart
          this.notificationsChart = new Chart({
            chart: {
              type: 'column',
              style: {
                fontFamily: "AvantGardeBT,DroidKufi"
              }
            },
            title: {
              text: ''
            },
            credits: {
              enabled: false
            },
        
            xAxis: {
              categories: this.notificationMonths,
              crosshair: true,
              scrollbar: {
                enabled: true
              },
            },
            yAxis: {
              min: 0,
              title: {
                text: null
              }
            },
            legend: {
              enabled: true,
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
              footerFormat: '</table>',
              shared: true,
              useHTML: true
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            series: 
            [
              {
                type: undefined,
                name: 'Notification Chart',
                data: this.notificationData,
                color: '#962172',
              }
            ]
          }); // end notification-chart
         
          // start questionnaire-Chart
          this.questionnaireChart = new Chart({
            chart: {
              type: 'column',
              style: {
                fontFamily: "AvantGardeBT,DroidKufi"
              }
            },
            title: {
              text: ''
            },
            credits: {
              enabled: false
            },
        
            xAxis: {
              categories: this.questionnaireMonths,
              crosshair: true,
              scrollbar: {
                enabled: true
              },
            },
            yAxis: {
              min: 0,
              title: {
                text: null
              }
            },
            legend: {
              enabled: true,
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
              footerFormat: '</table>',
              shared: true,
              useHTML: true
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            series: 
            [
              {
                name: 'Questionnaire Count',
                type: undefined,
                data: this.questionnaireData,
                color: '#962172',
              }, 
              {
                name: 'Questionnaire Total Participants',
                type: undefined,
                data: this.questionnaireTotalCountData,
                color: '#992eb2'
              }
            ]
          });
          // end questionnaire-Chart

          // start voting-Chart
          this.votingChart = new Chart({
            chart: {
              type: 'column',
              style: {
                fontFamily: "AvantGardeBT,DroidKufi"
              }
            },
            title: {
              text: ''
            },
            credits: {
              enabled: false
            },
        
            xAxis: {
              categories: this.votingMonths,
              crosshair: true,
              scrollbar: {
                enabled: true
              },
            },
            yAxis: {
              min: 0,
              title: {
                text: null
              }
            },
            legend: {
              enabled: true,
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
              footerFormat: '</table>',
              shared: true,
              useHTML: true
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            series: 
            [
              {
                name: 'Voting Count',
                type: undefined,
                data: this.votingeData,
                color: '#962172',
              }, 
              {
                name: 'Voting Total Participants',
                type: undefined,
                data: this.votingTotalCountData,
                color: '#992eb2'
              }
            ]
          });
          // end voting-Chart


          // Start voting-chart
          this.surveyChart = new Chart({
            chart: {
              type: 'column',
              style: {
                fontFamily: "AvantGardeBT,DroidKufi"
              }
            },
            title: {
              text: ''
            },
            credits: {
              enabled: false
            },
        
            xAxis: {
              categories: this.surveyMonths,
              crosshair: true,
              scrollbar: {
                enabled: true
              },
            },
            yAxis: {
              min: 0,
              title: {
                text: null
              }
            },
            legend: {
              enabled: true,
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
              footerFormat: '</table>',
              shared: true,
              useHTML: true
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            series: 
            [
              {
                name: 'Survey Count',
                type: undefined,
                data: this.surveyData,
                color: '#962172',
              }, 
              {
                name: 'Survey Total Participants',
                type: undefined,
                data: this.surveyTotalCountData,
                color: '#992eb2'
              }
            ]
          });

          // End voting-chart


          // start customer-chart
          this.customerChart = new Chart({
            chart: {
              type: 'column',
              style: {
                fontFamily: "AvantGardeBT,DroidKufi"
              }
            },
            title: {
              text: ''
            },
            credits: {
              enabled: false
            },
        
            xAxis: {
              categories: this.customerMonths,
              crosshair: true,
              scrollbar: {
                enabled: true
              },
            },
            yAxis: {
              min: 0,
              title: {
                text: null
              }
            },
            legend: {
              enabled: true,
            },
            tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
              footerFormat: '</table>',
              shared: true,
              useHTML: true
            },
            plotOptions: {
              column: {
                pointPadding: 0.2,
                borderWidth: 0
              }
            },
            series: 
            [
              {
                type: undefined,
                name: 'Customer Chart',
                data: this.customerData,
                color: '#962172',
              }
            ]
          }); // end customer-chart

          this.dataLoaded = true;

        }, (e) =>{
          //console.log(e);
          this.dataLoaded = true;
          //this.serviceError = true;
          if (e['status'] == 500) {
            this.errorMsg = e.error['message']
          } else {
            this.errorMsg = 'Service not avaliable now,Try again later.'
          }
        }
      );   
  }

}
