import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComplaintsService } from 'src/app/service/complaints.service';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css']
})
export class CategoryEditComponent implements OnInit {
  [x:string]:any;
  dataLoaded :boolean =false;
  constructor(private activatedRoute:ActivatedRoute , private route: Router ,private dataApi : ComplaintsService,
      private snack: MatSnackBar , private fb: FormBuilder) {
    this.activatedRoute.paramMap.pipe(map(() => window.history.state))
    .subscribe(async (data) => {
      console.log(data)
      if (data.complaintId == 1) {
        this.route.navigateByUrl("/complaintCategory")
      } else {
        // this.categoryId = data.categoryId;
        this.categoryId = sessionStorage.getItem("categoryId");
        // alert( this.categoryId);
        this.getMainCategoryByID(this.categoryId)
      }


  });
  }




  mainForm: FormGroup;
  submitLoaded :boolean = false;

  ngOnInit(): void {
    this.mainForm = this.fb.group({
    englishName: new FormControl('',[Validators.required]),
    arabicName: new FormControl('',[Validators.required]),
    isVisible: new FormControl(false),
    });

  }


  getMainCategoryByID(id){
    this.dataApi.getMainCategoryByID(id).subscribe(
      (res:any) => {
        console.log(res);
        this.mainCategory = res
        this.dataLoaded = true;
        this.mainForm.get('englishName')?.setValue(this.mainCategory.englishName);
        this.mainForm.get('arabicName')?.setValue(this.mainCategory.arabicName);
        this.mainForm.get('isVisible')?.setValue(this.mainCategory.isVisible);

      }, e => {
        console.log(e)
        this.dataLoaded = true;
      }

    )
  }



  editCategoryFormSubmit(){
    this.submitLoaded = true;
    console.log(this.mainForm.value);
    console.log(this.mainForm.valid)
    this.dataApi.updateCategory(this.categoryId,this.mainForm.value).subscribe(
      (res:any) => {
        console.log(res);
        this.submitLoaded = false;
        this.snack.open(res.englishMessage, 'OK', {
          duration: 5000
        });
      }, e => {
        console.log(e)
        this.submitLoaded = false;
        this.snack.open(e.error.message, 'Failed', {
          duration: 5000
        });
      }

    )

  }

  reset(){
    this.mainForm.get('englishName')?.setValue(this.mainCategory.englishName);
    this.mainForm.get('arabicName')?.setValue(this.mainCategory.arabicName);
    this.mainForm.get('isVisible')?.setValue(this.mainCategory.isVisible);
  }


}
