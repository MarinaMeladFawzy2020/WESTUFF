import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsCategoryService {

  constructor(private http: HttpClient) { }
  url: string = environment.host + environment.port + '/ControlPanelRestServices/newsCategory/';


   saveNewsCategory(newsCategory) {
    return this.http.post(this.url + 'saveNewsCategory', newsCategory)
  }

  editNewsCategory(newsCategory) {
    return this.http.post(this.url + 'editNewsCategory', newsCategory)
  }

  deleteNewsCategory(newsCategory) {
    return this.http.post(this.url + 'deleteNewsCategory', newsCategory)
  }

  getAllNewsCategories(pageNumber, limit, searchText) {
    //console.log('page number ='+pageNumber);
    //console.log('limit ='+limit);
    return this.http.post(this.url + 'getAllNewsCategory', { pageNumber, limit, searchText })
  }
  
  getNewsCategoryById(newsCategory) {
    return this.http.post(this.url + '/getNewsCategoryById', newsCategory)
  }

}
