import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
interface Role {
  id:number;
  moduleName?: string;

  moduleRoles?: ModuleRoles[];

}
interface ModuleRoles {
 id:number;
 name:string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url: string =  environment.host + environment.port + environment.text;
  id: number;
  username: string;
  jwtHelper = new JwtHelperService();

  roles: Role[] ;
  // = [
  //    {
  //     moduleName: "voting",

  //     roles:
  //       { add: true, edit: true,delete:false,view:true,approve:false },

  //   }
  // ]
  constructor(private http: HttpClient) {


  }

  login(encryptedUsername: string, encryptedPassword: string) {
   // encryptedUsername='uBKGi7Tai8VsuRbU7CHK+kmvXTbIRSgDEmJxPaJ5gk360ExPoR7+5u6e7I5LfpNqET1zQP7yH8KWGBgUAEvytDB6OyFBQmsQ2Fjy4OIoyrwcxbepVXQGiDi5Ru19ROxkO6O3mdz+8BfOe1/iaNccvn9KPmA8YoR4M7ue7Px4RGg=';
   // encryptedPassword= 'BHyYkgcZloW8yLvD2Nvghq30wB9vnB2PdGs3YnEmInCdc8m0wUqPx4DOZLn0yDBL9GLyf0/o0KrsGWiBaZ7h+pKWoNWn7lJs0jYscvUuxLxYiMtAFgrVGfKWx+qboFnljl4kqToSIYjavG4GMwDYgW78c5bXyvAa9Wk0EctwjMY=';
    return this.http.post(this.url+ '/authenticateCpUser', { encryptedUsername, encryptedPassword });

  }

  changeSpocPassword(encryptedOldPw,encryptedNewPw){
    return this.http.post(this.url+'/changeSpocPassword',{encryptedOldPw,encryptedNewPw})
  }

  removeToken() {
    localStorage.clear();
    // localStorage.removeItem('token');
  }

  isAuthenticated() {

    //return this.jwtHelper.isTokenExpired();
    let token = localStorage.getItem('token');

        if(!token)
            return false;

        let date = this.jwtHelper.getTokenExpirationDate(token);
        let isExpired = this.jwtHelper.isTokenExpired(token);

        //console.log(date);
        //console.log(isExpired);
       // //console.log(tokenNotExpired);

        return !isExpired;
  }

  get currentUser() {
    let token = localStorage.getItem('token');
    if (!token) return false;

    return this.jwtHelper.decodeToken(token);
  }


  getUserRoles(){

    let token = localStorage.getItem('token');
  //console.log(this.jwtHelper.decodeToken(token))
  console.log(this.roles)
    this.roles=this.jwtHelper.decodeToken(token).cpUserInfo.roles;

    return this.roles;
  }

}
