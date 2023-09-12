import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CorrespondenceDetailResponse } from '../Models/CorrespondenceDetailResponse';

@Injectable({
  providedIn: 'root'
})
export class CorrespondenceService {

  constructor(private http: HttpClient) { }
  url: string = environment.host + environment.port + environment.text;

  /** Start correspondenceCategory */

  saveCorrespondenceCategory(correspondenceCategory) {
    return this.http.post(this.url + '/CorrespondenceCategory/SaveCorrespondenceCategory', correspondenceCategory)
  }

  editCorrespondenceCategory(correspondenceCategory) {
    return this.http.post(this.url + '/CorrespondenceCategory/EditCorrespondenceCategory', correspondenceCategory)
  }

  deleteCorrespondenceCategory(correspondenceCategory) {
    return this.http.post(this.url + '/CorrespondenceCategory/DeleteCorrespondenceCategory', correspondenceCategory)
  }

  getCorrespondenceCategories(pageNumber, limit, searchText) {
    return this.http.post(this.url + '/CorrespondenceCategory/GetCorrespondenceCategories', { pageNumber, limit, searchText })
  }

  // used in drop down
  getAllCorrespondenceCategories() {
    return this.http.get(this.url + '/CorrespondenceCategory/GetAllCorrespondenceCategories')
  }

  getCorrespondenceCategoryById(correspondenceCategory) {
    return this.http.post(this.url + '/CorrespondenceCategory/GetCorrespondenceCategoryById', correspondenceCategory)
  }

  /** End correspondenceCategory */

  /** Start correspondence from*/

  saveCorrespondence(correspondence, file) {
    const formData = new FormData();
    if (file) {
      formData.append("file", file, file.name);
    }
    formData.append("addCorrespondenceFormRequestDto", JSON.stringify(correspondence));
    return this.http.post(this.url + '/Correspondence/SaveCorrespondence', formData)
  }

  editCorrespondence(correspondence,file) {
    const formData = new FormData();
    if (file) {
      formData.append("file", file, file.name);
    }
    formData.append("EditCorrespondenceFromRequestDto", JSON.stringify(correspondence));
    return this.http.post(this.url + '/Correspondence/EditCorrespondence', formData)
  }

  deleteCorrespondence(correspondence) {
    return this.http.post(this.url + '/Correspondence/DeleteCorrespondence', correspondence)
  }

  getCorrespondence(pageNumber, limit, searchText,correspondenceCategoryId) {
    return this.http.post(this.url + '/Correspondence/GetAllCorrespondence', { pageNumber, limit, searchText,correspondenceCategoryId })
  }

  getCorrespondenceById(correspondence) {
    return this.http.post <CorrespondenceDetailResponse>(this.url + '/Correspondence/GetCorrespondenceById', correspondence)
  }

  /** End correspondence from*/

}
