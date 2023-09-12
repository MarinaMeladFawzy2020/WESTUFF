import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  url: string = environment.host + environment.port + environment.text;

  constructor(private http: HttpClient) { }

  getStatisticsData() {
    return this.http.get(this.url + '/Home/Statistics/GetData',{});
  }
}
