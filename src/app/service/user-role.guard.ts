import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  NavigationEnd,
} from "@angular/router";
import { AuthService } from "../service/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable()
export class UserRoleGuard implements CanActivate {

  previousUrl = "";
  constructor(private router: Router, private jwtAuth: AuthService, private snack: MatSnackBar) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var user = this.jwtAuth.getUserRoles();
    let accessible = false;
    user.forEach(item => {
      if (route.data.roles.includes(item.moduleName)) {
        accessible = true;
      }
    })

    this.router.events.subscribe(event => {
      this.previousUrl = this.router.url;
      if (event instanceof NavigationEnd) {   
        this.previousUrl = this.router.url;
        //console.log("Previous URL: "+this.previousUrl);     

      };
    });

    //console.log('role ')
    if (
      user &&
      route.data &&
      route.data.roles &&
      accessible
    ) {
      return true;
    } else {
      this.snack.open('You do not have access to this page!', 'OK', {
        duration: 5000
      });
      this.router.navigateByUrl(this.previousUrl)
      return false;
    }
  }

}
