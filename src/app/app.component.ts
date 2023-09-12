import { Component } from '@angular/core';
import { RoutesRecognized, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'portaltool';


  constructor(private router: Router,private authService:AuthService) {
    router.events.subscribe((val) => {
      //console.log(val)
      ////console.log(val instanceof NavigationEnd)
      // see also 
         //console.log(authService.isAuthenticated())
        // //console.log(val) 
        if(val instanceof RoutesRecognized){
          //console.log(val.id);
        }
        if(val instanceof NavigationEnd){
          //console.log(val.url)
          //console.log(authService.isAuthenticated())
          if(val.url != '/' && !authService.isAuthenticated()){
            //console.log('Not Authenticated')
            this.router.navigate(['/']);
            this.authService.removeToken();
          }
        }
    });
  }
}
