import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { VisitParams } from '../_models/visitParams';
import { PaginatedResult } from '../_models/pagination';
import { Member } from '../_models/member';
import { map } from 'rxjs';
import { setPaginatedResponse } from './paginationHelper';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class VipService {
    baseUrl = environment.apiUrl;
    private http = inject(HttpClient);
     private accountService = inject(AccountService);
    paginatedResult = signal<PaginatedResult<Member[]> | null>(null); 
    memberCache = new Map();
    visitParams = signal<VisitParams>(new VisitParams());
    user = this.accountService.currentUser();


   resetVisitParams() {
      this.visitParams.set(new VisitParams())
    }
    getVisitParams() {
       return this.visitParams();
     }

     setVisitParams(params: VisitParams) {
    this.visitParams.set(params);
    }


     
  trackVisit(visitedId: number) {
  return this.http.post(`${this.baseUrl}visits/${visitedId}`, {}, { responseType: 'text' });
}


  getVisits() {
    const response = this.memberCache.get(Object.values(this.visitParams()).join('-'));
     if(response) return setPaginatedResponse(response, this.paginatedResult);
    let params = this.setPaginationHeaders(this.visitParams().pageNumber,this.visitParams().pageSize);
    params = params.append('filter', this.visitParams().filter); 
    params = params.append('tab', this.visitParams().tab);
    

     return this.http.get<Member[]>(this.baseUrl + 'visits', { observe: 'response', params }).subscribe({
      next: response => {

        setPaginatedResponse(response, this.paginatedResult);
        this.memberCache.set(Object.values(this.visitParams()).join('-'), response);
       
      }
    })
  }
   private setPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }

    return params;

  }
  
}
