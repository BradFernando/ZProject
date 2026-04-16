import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Policy, PolicyType, PolicyStatus } from '../models/insurance.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private readonly API_URL = `${environment.apiUrl}/policies`;

  constructor(private readonly http: HttpClient) {}

  getPolicies(filters?: { type?: PolicyType, status?: PolicyStatus, startDateFrom?: string, startDateTo?: string }): Observable<Policy[]> {
    let params = new HttpParams();
    if (filters) {
      if (filters.type) params = params.set('type', filters.type);
      if (filters.status) params = params.set('status', filters.status);
      if (filters.startDateFrom) params = params.set('startDateFrom', filters.startDateFrom);
      if (filters.startDateTo) params = params.set('startDateTo', filters.startDateTo);
    }
    return this.http.get<Policy[]>(this.API_URL, { params });
  }

  createPolicy(policy: Policy): Observable<Policy> {
    return this.http.post<Policy>(this.API_URL, policy);
  }

  cancelPolicy(id: number): Observable<Policy> {
    return this.http.post<Policy>(`${this.API_URL}/${id}/cancel`, {});
  }

  getPoliciesByClient(clientId: number): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${this.API_URL}/client/${clientId}`);
  }
}
