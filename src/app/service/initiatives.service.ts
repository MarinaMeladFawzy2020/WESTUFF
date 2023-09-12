import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IntiativesService {
  constructor(private http: HttpClient) { }
  url: string = environment.host + environment.port + environment.text;



  getAllInitiatives(pageNumber, limit, searchText) {
    return this.http.post(this.url + '/initiative/getAllInitiatives', { pageNumber, limit, searchText})
  }


  addNewOffer(offerDto, file) {
    // Create form data
    //console.log('in out', (file))

    const formData = new FormData();
    //console.log(JSON.stringify(offerDto))
    formData.append("file", file, file.name);

    // Store form name as "file" with file data
    //console.log(JSON.stringify(offerDto))
    formData.append("addOffersDto", JSON.stringify(offerDto));


    return this.http.post(this.url + '/offer/addNewOffers', formData)

  }

  addNewIntiatives(intiativesDto, image, video) {
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
    //console.log(JSON.stringify(intiativesDto))
    formData.append("addInitiativeRequest", JSON.stringify(intiativesDto));

    return this.http.post(this.url + '/initiative/addInitiative', formData)

  }

  getOfferDetails(id) {
    return this.http.post(this.url + '/offer/getOfferById', id)
  }


  editIntiativesService(medicalInfoDto, image, video) {
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
    formData.append("editInitiativeRequest", JSON.stringify(medicalInfoDto));
    return this.http.post(this.url + '/initiative/editInitiative', formData)

  }



  deleteIntiatives(id) {
    return this.http.post(this.url + '/initiative/deleteInitiativeById', { id })
  }

  getInitiativeById(id) {

    return this.http.post(this.url + '/initiative/getInitiativeById', { id})
  }


}
