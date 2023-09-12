import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComplaintsService {

  constructor(private http: HttpClient) { }
  url: string = environment.host + environment.port + environment.text;

  getAllcategory(pageNumber, pageSize) {
    return this.http.get(this.url + `/complaint/category?pageNum=${pageNumber}&pageSize=${pageSize}`) ;
  }

  saveCategory(categoryobj) {
    return this.http.post(this.url + `/complaint/category` , categoryobj) ;
  }

  getMainCategoryByID(categoryId) {
    return this.http.get(this.url + `/complaint/category/${categoryId}`) ;
  }

  getSubCategory(pageNumber, pageSize , categoryId) {
    return this.http.get(this.url + `/complaint/category/${categoryId}/subcategory?pageNum=${pageNumber}&pageSize=${pageSize}`) ;
  }

  updateCategory(categoryId , categoryobj) {
    return this.http.put(this.url + `/complaint/category/${categoryId}` , categoryobj) ;
  }


  saveSubCategory(categoryobj) {
    return this.http.post(this.url + `/complaint/category` , categoryobj) ;
  }

  deleteSubCategory(categoryId) {
    return this.http.delete(this.url + `/complaint/subCategory/${categoryId}`) ;
  }


  getAllcomplaint(pageNumber, pageSize , obj) {
    return this.http.post(this.url + `/complaint/all?pageNum=${pageNumber}&pageSize=${pageSize}` , obj) ;
  }

  getComplaintByID(complaintID) {
    return this.http.get(this.url + `/complaint/${complaintID}`) ;
  }

  getComplaintFeedbackList(complaintID){
    return this.http.get(this.url + `/complaint/${complaintID}/feedback`) ;
  }

  submitComplaintFeedback(complaintID , obj){
    return this.http.post(this.url + `/complaint/${complaintID}/feedback` , obj) ;
  }

  updateComplaintStatus(complaintID , statusID ){
    return this.http.put(this.url + `/complaint/${complaintID}?statusId=${statusID}` ,{}) ;
  }

}
