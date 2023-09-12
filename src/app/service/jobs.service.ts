import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  constructor(private http: HttpClient) { }
  url: string = environment.host + environment.port + environment.text;



  getAllJobAnnouncements(pageNumber, limit, searchText) {
    return this.http.post(this.url + '/jobAnnouncement/getAllJobAnnouncements', { pageNumber, limit, searchText})
  }




  addJobAnnouncement(jobsDto, image, doc,pdf) {
    // Create form data
    // //console.log('in out',(image))
    // //console.log('in out',(video))
    const formData = new FormData();
    ////console.log(JSON.stringify(offerDto))
    if (image) {
      formData.append("image", image, image.name);
    }
    if (doc) {
      formData.append("doc", doc, doc.name);
    }
    if (pdf) {
        formData.append("pdf", pdf, pdf.name);
      }
    // Store form name as "file" with file data
    //console.log(JSON.stringify(jobsDto))
    formData.append("addJobAnnouncementRequest", JSON.stringify(jobsDto));

    return this.http.post(this.url + '/jobAnnouncement/addJobAnnouncement', formData)

  }




  editJobAnnouncementService(jobsDto, image, doc,pdf) {
    // Create form data
    //console.log('in out', (image))
    //console.log('in out', (doc))
    const formData = new FormData();
    ////console.log(JSON.stringify(offerDto))
    if (image) {
        formData.append("image", image, image.name);
      }
      if (doc) {
        formData.append("doc", doc, doc.name);
      }
      if (pdf) {
          formData.append("pdf", pdf, pdf.name);
        }
    // Store form name as "file" with file data
    //console.log(JSON.stringify(jobsDto))
    formData.append("editJobAnnouncementRequest", JSON.stringify(jobsDto));
    return this.http.post(this.url + '/jobAnnouncement/editJobAnnouncement', formData)

  }



  deleteJobAnnouncementById(id) {
    return this.http.post(this.url + '/jobAnnouncement/deleteJobAnnouncementById', { id })
  }

  getJobAnnouncementById(id) {

    return this.http.post(this.url + '/jobAnnouncement/getJobAnnouncementById', { id})
  }


}
