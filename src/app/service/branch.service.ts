import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(private http: HttpClient) { }

  url: string = environment.host + environment.port + '/EntitySpocServices';

  assignManagerToBranch(branchManagerId, branchId, assignedRoles) {
    return this.http.post(this.url + '/assignManagerToBranch'
      , { branchManagerId, branchId, assignedRoles })
  }

  unassignBranchFromBranchManager(branchManagerId, branchId) {
    return this.http.post(this.url + '/unassignBranchFromBranchManager'
      , { branchManagerId, branchId })
  }

  GetBranchManagerAssignedBranches(pageNumber,limit,searchText, branchManagerId ) {
    return this.http.post(this.url + '/branchManagerAssignedBranches', { pageNumber,limit,searchText, branchManagerId})
  }

  updateBranchManagerRoles(branchManagerId, branchId, assignedRoles) {
    return this.http.post(this.url + '/updateBranchManagerRoles'
      , { branchManagerId, branchId, assignedRoles })
  }

  branchManagerAssignedBranchesRoles(managerAssignedBranchId){
    return this.http.post(this.url + '/branchManagerAssignedBranchesRoles'
    , { managerAssignedBranchId })
  }
}
