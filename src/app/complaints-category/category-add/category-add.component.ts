import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComplaintsService } from 'src/app/service/complaints.service';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.css']
})
export class CategoryAddComponent implements OnInit {


  constructor(private dataApi : ComplaintsService, public dialogRef: MatDialogRef<any> , private snack: MatSnackBar , private fb: FormBuilder) { }
  subCategories:any=[];
  mainForm: FormGroup;
  subDataArray: FormArray;
  submitLoaded :boolean = false;

  ngOnInit(): void {
    this.mainForm = this.fb.group({
    englishName: new FormControl('',[Validators.required]),
    arabicName: new FormControl('',[Validators.required]),
    isVisible: new FormControl(false),

     compliantSubCategories: this.fb.array([
       this.createSubDataItem(), // Add an initial item to the array
      ])
    });
    this.subDataArray = this.mainForm.get('compliantSubCategories') as FormArray;

  }

  createSubDataItem() {
    return this.fb.group({
      englishName: ['', Validators.required],
      arabicName:['', Validators.required],
      isVisible: new FormControl(false),
    });
  }

  // Helper method to add items to the subData array
  addSubDataItem() {
    const subDataArray = this.mainForm.get('compliantSubCategories') as FormArray;
    subDataArray.push(this.createSubDataItem());
  }




  addNewCategoryFormSubmit(){
    this.submitLoaded = true;

  console.log(this.mainForm.value);
  console.log(this.mainForm.valid)

    this.dataApi.saveCategory(this.mainForm.value).subscribe(
      (res:any) => {
        console.log(res);
        this.submitLoaded = false;
        this.snack.open(res.englishMessage, 'OK', {
          duration: 5000
        });
       this.dialogRef.close()
      }, e => {
        console.log(e)
        this.submitLoaded = false;
        this.snack.open(e.error.message, 'Failed', {
          duration: 5000
        });
      }

    )

  }


  removeItem(index) {
    if(this.subDataArray.length == 1){
      this.snack.open("A Complaint Category Must Contain at least one SubCategory", 'Failed', {
        duration: 5000
      });
    }else{
      this.subDataArray.controls.splice(index,1)
    }
  }



}



