import { Component, OnInit } from '@angular/core';
import { config } from 'src/config';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-voting-module',
  templateUrl: './voting-module.component.html',
  styleUrls: ['./voting-module.component.css']
})
export class VotingModuleComponent implements OnInit {
  add: boolean;
  view: boolean;
  viewstat: boolean
  constructor(private authSerivce: AuthService) {

    if (this.authSerivce.getUserRoles().filter(item => config.authRoles.Voting.includes(item.moduleName))[0].moduleRoles.filter(i => i.name == config.rolesAction.viewStatistics).length == 0) {
      this.viewstat = false;
    }
    else {
      this.viewstat = true;
    }
    //console.log('stat ', this.viewstat)

  }

  ngOnInit(): void {
  }

}
