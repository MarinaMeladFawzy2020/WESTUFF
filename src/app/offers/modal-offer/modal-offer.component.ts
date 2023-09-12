import { Component, Inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuestionModalComponent } from 'src/app/questions/question-modal/question-modal.component';
import { BannerDetail } from 'src/app/Models/BannerDetail';
import { BannersService } from 'src/app/service/banner.service';
import { EditOffer } from 'src/app/Models/EditOffer';
import { OffersDetail } from 'src/app/Models/OfferDetails';
import { OffersService } from 'src/app/service/offer.service';
import { EditOfferCategory } from 'src/app/Models/EditOfferCategory';


interface DialogData {
  email: string;
}

@Component({
  selector: 'app-modal-offer',
  templateUrl: './modal-offer.component.html',
  styleUrls: ['./modal-offer.component.css']
})
export class ModalOfferComponent implements OnInit {

  file: FileList;
  dataLoaded: boolean = true;
  submittable = false;
  myGroup = new FormGroup({
    title: new FormControl("", [Validators.required]),
    offerCatName:new FormControl(""),
    startDate: new FormControl("", [Validators.required]),
    endDate:new FormControl("", [Validators.required]),
    description:new FormControl("", [Validators.required]),
    partnerName:new FormControl("", [Validators.required])

    
  });

  constructor(
    public dialogRef: MatDialogRef<QuestionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private service: OffersService, private snack: MatSnackBar, public datepipe: DatePipe) { 

    //console.log(' this.submittable ', this.submittable )
    this.myGroup.valueChanges.subscribe(res => {
      if (this.myGroup.valid) {
        this.submittable = true;
        //console.log(this.myGroup.value)
      } else {
        this.submittable = false;
        //console.log(this.myGroup.value)
      }
    });

    }

  onNoClick(): void {
    this.dialogRef.close();
  }
  offerId: number;
  offerUpload = false
  public offer: OffersDetail =
    {
      // offerCategoryId:null,
      offerCategoryName: '',
      id: null,
      title: '',
      partnerName: '',
      startDate: null,
      addedDate: null,
      createdBy: '',
      description: '',
      mediaName: '',
      endDate: null,
      //offerCategory:null,
      newOffer: false,
      // notified: false,
      isUploadFile: false

    }


  ngOnInit() {

    //console.log('data ', this.data)
    this.offerId = this.data['offerId'];

    this.service.getOfferDetails(this.offerId).subscribe(

      res => {
        //console.log('after ', res)
        this.dataLoaded = true;
        // //console.log('after ',res.offerCategory.arabicName)
        // //console.log('after ',res.desc)

        this.offer = res;
        this.offer.offerCategoryName = this.offer.offerCategory.englishName
        //console.log('this offer ', this.offer.offerCategoryName)
        this.offer.offerCategoryId = this.offer.offerCategory.id
        //console.log('this offer ', this.offer.offerCategoryId)
        //  this.offer.startDate=this.datepipe.transform(res.startDate, 'yyyy-MM-dd\'T\'HH:mm');//'yyyy-MM-ddThh:mm'
        //  this.offer.endDate=this.datepipe.transform(res.endDate, 'yyyy-MM-dd\'T\'HH:mm');
        //this.offer.offerCategoryName=this.offer.offerCategory.offerCategoryName;

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
    this.offer.isUploadFile = this.offerUpload
    //console.log(this.offer.isUploadFile)
    this.offer.files = this.file
    this.dialogRef.close(this.offer)

    //console.log('lll ', this.offer)
    //console.log(' offer ', this.offer)

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
      this.offer.mediaName = reader.result;
    }
    //console.log(event)
    this.offerUpload = true;
    this.file = event.target.files[0];
    //console.log('event.target.files[0]', event.target.files[0])
    //console.log(this.file)

  }





}
