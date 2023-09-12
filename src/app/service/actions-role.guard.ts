import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { AuthService } from "../service/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { config } from "src/config";

@Injectable()
export class ActionRoleGuard implements CanActivate {
  constructor(private router: Router, private jwtAuth: AuthService, private snack: MatSnackBar) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //console.log(this.jwtAuth.getUserRoles().filter(item=>config.authRoles.UserManagement.includes(item.moduleName))[0].moduleRoles.filter(i=>i.name==config.rolesAction.add).length)

    var user = this.jwtAuth.getUserRoles();
    let accessible=false;
    user.forEach(item=>{if(route.data.roles.includes(item.moduleName)){
      accessible=true;
    }})
    
//console.log('role ',)
    if (
      user &&
      route.data &&
      route.data.roles &&
      accessible
    ) {
      return true;
    } else {
      this.snack.open('You do not have access to this page!', 'OK',{
        duration: 5000
      });
      return false;
    }
  }
}
