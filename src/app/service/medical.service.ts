import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicalManagerService {

  constructor(private http: HttpClient) { }
  url: string = environment.host + environment.port + environment.text;


  upload(categoryID, file) {

    // Create form data
    let formData = new FormData();

    // Store form name as "file" with file data
    formData.append("file", file, file.name);
    formData.append("medNetworkId", categoryID);

    // Make http post request over api
    // with formData as req
    return this.http.post(this.url + '/medical/saveMedNetwork', formData)
  }
  getMedicalCategorieslookUp() {
    return this.http.get(this.url + '/medical/getAllMedNetwork')
  }

  getAllMedicalFiles(pageNumber, limit, searchText) {
    return this.http.post(this.url + '/medical/getAllMedicalFilesUploaded', { pageNumber, limit, searchText })
  }


  ///////////////////////Medical Info service////////////////////////////
  getMedicalCategoryLookup() {
    return this.http.get(this.url + '/medicalCategory/getMedicalCategoryLookup')
  }

  getAllMedicalInformation(pageNumber, limit, searchText) {
    return this.http.post(this.url + '/medical/getAllMedicalInformation', { pageNumber, limit, searchText })
  }

  getMedicalInfoDetailsById(id) {

    return this.http.post(this.url + '/medical/getMedicalInformationById', { id: id})
  }



  addNewMedicalInfoService(medicalInfoDto, image, video) {
    // Create form data
    // //console.log('in out',(image))
    // //console.log('in out',(video))
    const formData = new FormData();
    ////console.log(JSON.stringify(offerDto))
    if (image) {
      formData.append("image", image, image.name);
    }
    if (video) {
      formData.append("video", video, video.name);
    }
    // Store form name as "file" with file data
    //console.log(JSON.stringify(medicalInfoDto))
    formData.append("addMedicalInfoDto", JSON.stringify(medicalInfoDto));

    return this.http.post(this.url + '/medical/addMedicalInformationTopic', formData)

  }



  editNewMedicalInfoService(medicalInfoDto, image, video) {
    // Create form data
    //console.log('in out', (image))
    //console.log('in out', (video))
    const formData = new FormData();
    ////console.log(JSON.stringify(offerDto))
    if (image) {
      formData.append("image", image, image.name);
    }
    if (video) {
      formData.append("video", video, video.name);
    }

    // Store form name as "file" with file data
    //console.log(JSON.stringify(medicalInfoDto))
    formData.append("editMedicalInfoDto", JSON.stringify(medicalInfoDto));
    return this.http.post(this.url + '/medical/editMedicalInformationTopic', formData)

  }


}
