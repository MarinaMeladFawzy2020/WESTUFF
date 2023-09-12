import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BannersService {
    constructor(private http: HttpClient) { }
    url: string = environment.host + environment.port + environment.text;


    addBanner(banner) {
        return this.http.post(this.url + '/Banner/AddBanner', banner)
      }

      addNewBanner(bannerDto,file) {
        // Create form data
        //console.log('in out',(file))

      const formData = new FormData();
      //console.log(JSON.stringify(bannerDto))
      formData.append("file", file, file.name);

      // Store form name as "file" with file data
      //console.log(JSON.stringify(bannerDto))
        formData.append("bannersDto",JSON.stringify(bannerDto) );


      return this.http.post(this.url + '/banner/addNewBanner',formData )

      }




      editBanner(bannerDto,file) {
        // Create form data
        //console.log('in edit',(file))


      const formData = new FormData();
      //console.log(JSON.stringify(bannerDto))
      if(file)
      {
      formData.append("file", file, file.name);
      }
      // Store form name as "file" with file data
      //console.log(JSON.stringify(bannerDto))
        formData.append("editBannersDto",JSON.stringify(bannerDto) );


      return this.http.put(this.url + '/banner/editBanner',formData )

      }




      // editBanner(banner) {
      //   return this.http.post(this.url + '/Banner/UpdateBanner', banner)
      // }

      getAllBanner(pageNumber, limit, searchText) {
        return this.http.post(this.url + '/banner/getAllBanners', { pageNumber, limit, searchText})
      }

      getAllBannerTypeLookup() {
        return this.http.get(this.url + '/banner/getAllBannerTypeLookup')
      }



}
