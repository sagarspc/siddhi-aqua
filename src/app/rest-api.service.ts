import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from './_services/token-storage.service';

@Injectable({
  providedIn: 'root'
})                                                                                                                                                
export class RestApiService {

  constructor(private http: HttpClient,private tokenStorageService: TokenStorageService) { }

  getHeaders() {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders().set('x-access-token', token) : null;
  }

  get(link: string) {
    return this.http.get(link, { headers: this.getHeaders() }).toPromise();
  }

  post(link: string, body: any) {
    return this.http.post(link, body, { headers: this.getHeaders() }).toPromise();
  }

  put(link: string, body: any) {
    return this.http.put(link, body, { headers: this.getHeaders() }).toPromise();
  }
  
  delete(link: string) {
    return this.http.delete(link).toPromise();
  }

}
