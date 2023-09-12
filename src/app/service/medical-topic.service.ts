import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicalTopicService {

  constructor(private http: HttpClient) { }
  url: string = environment.host + environment.port + environment.text;

  addMedicalTopicCategory(medicalTopicCategory) {
    return this.http.post(this.url + '/medicalCategory/saveMedicalCategroy', medicalTopicCategory)
  }

  editMedicalTopicCategory(medicalTopicCategory) {
    return this.http.post(this.url + '/medicalCategory/editMedicalCategroy', medicalTopicCategory)
  }

  getAllMedicalTopicCategory(pageNumber, limit, searchText) {
    return this.http.post(this.url + '/medicalCategory/getAllMedicalCategroy', { pageNumber, limit, searchText})
  }

  getMedicalTopicCategoryLookup() {
    return this.http.get(this.url + '/medicalCategory/getMedicalCategoryLookup')
  }

  deleteMedicalTopicCategoryById(medicalTopicCategoryId) {
    return this.http.post(this.url + '/medicalCategory/deleteMedicalCategroy' , {medicalTopicCategoryId})
  }

}
