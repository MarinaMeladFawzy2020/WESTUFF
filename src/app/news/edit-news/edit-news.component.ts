import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditNewsRequest } from 'src/app/Models/edit-news-request';
import { News } from 'src/app/Models/news';
import { NewsRequest } from 'src/app/Models/news-request';
import { NewsDto } from 'src/app/Models/NewsDto';
import { QuestionModalComponent } from 'src/app/questions/question-modal/question-modal.component';
import { NewsService } from 'src/app/service/news.service';
import { OffersService } from 'src/app/service/offer.service';

@Component({
  selector: 'app-edit-news',
  templateUrl: './edit-news.component.html',
  styleUrls: ['./edit-news.component.css']
})
export class EditNewsComponent implements OnInit {
 
  file: FileList;
  dataLoaded: boolean = true;
  submittable = true;

  myGroup = new FormGroup({
   // name: new FormControl("", [Validators.required]),
    active:new FormControl()  });

  constructor(
    public dialogRef: MatDialogRef<QuestionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private newsService: NewsService, private snack: MatSnackBar, public datepipe: DatePipe) {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  newsId: number;
  newsUpload = false
  public news: News =
    {
      newsCategory: null,
      id: null,
      title: '',
      description: '',
      publishDate: null,
      newsDate: null,
      mediaName: '',
      active: false,
      showInSlider: false,
      uploadMedia: false

    }

  ngOnInit() {
    //console.log('news info', this.data)
    this.newsId = this.data['newsId'];
    //console.log('news id ' + this.newsId);
    this.newsService.getNewsById(this.newsId).subscribe(

      res => {
        //console.log('data ', res)
        this.dataLoaded = true;
       // this.news = this.data['payload'];
        this.news = res;
        this.news.newsCategory = this.news.newsCategory;
        //console.log('publishDate ', this.news.publishDate);
        //console.log('this News Category', this.news.newsCategory);
        
      }, e => {
        //console.log(e)
        this.dataLoaded = true;
        this.snack.open('Error please try again later', 'Failed', {
          duration: 5000
        });
      }
    )


  }


  submit() {
    this.news.uploadMedia = this.newsUpload
    //console.log(this.news.uploadMedia)
    this.news.files = this.file
    this.dialogRef.close(this.news)
    //console.log(' news afetr submitted', this.news)

  }
  onChange(event) {
    if (event.target.files[0].length === 0)
      return;

    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }


    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (_event) => {
      this.news.mediaName = reader.result;
    }
    //console.log(event)
    this.newsUpload = true;
    this.file = event.target.files[0];
    //console.log('event.target.files[0]', event.target.files[0])
    //console.log(this.file)

  }
}
