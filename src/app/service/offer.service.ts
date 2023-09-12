import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OffersService {
  constructor(private http: HttpClient) { }
  url: string = environment.host + environment.port + environment.text;

  addOfferCategory(offerCategory , image) {

    const formData = new FormData();

    formData.append("image", image, image.name);

    formData.append("offerCategory", JSON.stringify(offerCategory));
    debugger;
    return this.http.post(this.url + '/offerCategory/saveOfferCategroy', formData)
  }

  editOfferCategory(offerCategory , image ) {

    const formData = new FormData();
    if (image) {
      formData.append("image", image, image.name);

    }
    formData.append("offerCategory", JSON.stringify(offerCategory));

    debugger;

    return this.http.post(this.url + '/offerCategory/editOfferCategroy', formData)
  }

  getAllOfferCategory(pageNumber, limit, searchText) {
    return this.http.post(this.url + '/offerCategory/getAllOfferCategroy', { pageNumber, limit, searchText })
  }


  getAllOffers(pageNumber, limit, searchText, newOffer, offerCategoryId) {
    return this.http.post(this.url + '/offer/getAllOffers', { pageNumber, limit, searchText, newOffer, offerCategoryId })
  }

  getAllOfferCategoryLookup() {
    return this.http.get(this.url + '/offerCategory/getOfferCategoryLookup')
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


    debugger;
    return this.http.post(this.url + '/offer/addNewOffers', formData)

  }


  getOfferDetails(id) {
    return this.http.post(this.url + '/offer/getOfferById', id)
  }


  editOffer(offerDto, file) {
    // Create form data
    //console.log('in edit', (file))


    debugger;
    const formData = new FormData();
    //console.log(JSON.stringify(offerDto))
    if (file) {
      formData.append("file", file, file.name);
    }
    // Store form name as "file" with file data
    //console.log(JSON.stringify(offerDto))
    formData.append("editOffersDto", JSON.stringify(offerDto));


    return this.http.post(this.url + '/offer/editNewOffers', formData)

  }


  deleteOfferCategoryById(offerCategroyId) {
    return this.http.post(this.url + '/offerCategory/deleteOfferCategroy', { offerCategroyId })
  }

  deleteOfferById(offerId) {
    return this.http.post(this.url + '/offer/deleteOfferById', { offerId })
  }

}
