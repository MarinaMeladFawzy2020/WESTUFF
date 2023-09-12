import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BranchManagerService {

  constructor(private http: HttpClient) { }
  url: string = environment.host + environment.port + environment.text;

  allBranchesByEcrmAccount() {
    return this.http.get(this.url + '/allBranchesByEcrmAccount/')
  }
  addNewUser(newUser) {
    return this.http.post(this.url + '/user/addUser', newUser)
  }
  getModulesRoleslookUp() {
    return this.http.get(this.url + '/modulesRole/modulesRoleLookups')
  }

  getBranchManagersList(pageNumber, limit, searchText) {
    return this.http.post(this.url + '/getBranchManagersList', { pageNumber, limit, searchText })
  }
  getUserById(id) {
    return this.http.post(this.url + '/roles/userDetail',{id})
  }
  activateBranchManager(branchManagerId) {
    return this.http.post(this.url + '/activateBranchManager', { branchManagerId })
  }
  deactivateBranchManager(branchManagerId) {
    return this.http.post(this.url + '/deactivateBranchManager', { branchManagerId })
  }
  deleteBranchManager(branchManagerId) {
    return this.http.post(this.url + '/deleteBranchManager', { branchManagerId })
  }
  resetBranchManagerPassword(branchManagerId) {
    return this.http.post(this.url + '/resetBranchManagerPassword', { branchManagerId })
  }
}
