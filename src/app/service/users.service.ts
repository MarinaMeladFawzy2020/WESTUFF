import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
    constructor(private http: HttpClient) { }
    url: string = environment.host + environment.port + environment.text;

    getAllUsers(pageNumber, limit, searchText) {
        return this.http.post(this.url + '/user/allUser', { pageNumber, limit, searchText })
      }

      getAllNotifications(pageNumber, limit, searchText,topicId) {
        return this.http.post(this.url + '/Notification/GetAllNotifications', { pageNumber, limit, searchText , topicId })
      }

      activateUser(id) {
        return this.http.post(this.url + '/user/active', { id })
      }
      deactivateUser(id) {
        return this.http.post(this.url + '/user/deActive', { id })
      }

      editUserInfo(userInfo) {
        return this.http.post(this.url + '/user/editUserInfo', userInfo)
      }

      editUserRoles(userRole) {
        return this.http.post(this.url + '/user/editUserRole', userRole)
      }



      deleteUser(id) {
        return this.http.post(this.url + '/user/delete', { id })
      }

// replace it with our services
      addBranchManager(branchManager) {
        return this.http.post(this.url + '/addBranchManager', branchManager)
      }
      branchManagerRoles() {
        return this.http.get(this.url + '/branchManagerRoles')
      }

      getBranchManagersList(pageNumber, limit, searchText) {
        return this.http.post(this.url + '/getBranchManagersList', { pageNumber, limit, searchText })
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
