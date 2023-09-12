import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(private http: HttpClient) { }
  url :string = environment.host + environment.port + '/ControlPanelRestServices/';

  getNewsCategoryLookup() {
    return this.http.get(this.url + 'newsCategory/getNewsCategoryLookup')
  }


  getAllNews(pageNumber, limit, searchText, newsCategoryId) {
    return this.http.post(this.url + 'news/getAllNews', { pageNumber, limit, searchText, newsCategoryId })
  }

  addNews(newsDto, file) {
    // Create form data 
    //console.log('in out', (file))
    const formData = new FormData();
    //console.log(JSON.stringify(newsDto))
    formData.append("file", file, file.name);
    //console.log(JSON.stringify(newsDto))
    formData.append("addNewsDto", JSON.stringify(newsDto));
    return this.http.post(this.url + 'news/addNews', formData)
  }


  getNewsById(id) {
    return this.http.post(this.url + 'news/getNewsById', id)
  }
  
  editNews(editNewsDto, file) {
    // Create form data 
    //console.log('edit file', (file))
    const formData = new FormData();
    //console.log(JSON.stringify(editNewsDto))
    if (file) {
      formData.append("file", file, file.name);
    }
    // Store form name as "file" with file data 
    //console.log(JSON.stringify(editNewsDto))
    formData.append("editNewsDto", JSON.stringify(editNewsDto));
    return this.http.post(this.url + 'news/editNews', formData)
  }

  deleteNewsById(newsId) {
    return this.http.post(this.url + 'news/deleteNewsById', { newsId })
  }
}
