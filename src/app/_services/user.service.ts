import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const API_URL = 'http://192.168.1.207:8080/api/test/';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = 'http://192.168.1.207:8080/api/test/user';
  private adminUrl = 'http://192.168.1.207:8080/api/test/admin'
  private modUrl = 'http://192.168.1.207:8080/api/test/mod';
  private roleUrl = 'http://192.168.1.207:8080/api/role';
  private addressUrl = 'http://192.168.1.207:8080/api/test/address';
  private profileUrl = 'http://192.168.1.207:8080/api/test/profile';
  private apiUrl = 'https://api.covid19api.com/summary'
  constructor(private http: HttpClient) { }

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }

  addUser (user: User): Observable<User> {
    return this.http.post<User>(this.userUrl, user, httpOptions);
  }
  // updateUser (user: User): Observable<User> {
  //   return this.http.put<User>(this.userUrl, user, httpOptions);
  // }
  addRole (role: any): Observable<[]> {
    return this.http.post<[]>(this.roleUrl, role, httpOptions);
  }

  getAllrole(): Observable<any> {
    return this.http.get(this.roleUrl);
  }

  getUserBoard(): Observable<any> {
    return this.http.get(this.userUrl);
  }

  // getModeratorBoard(): Observable<any> {
  //   return this.http.get(API_URL + 'mod', { responseType: 'text' });
  // }

  getModeratorBoard(): Observable<any> {
    return this.http.get(this.modUrl);
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(this.adminUrl);
  }
  getProfile(): Observable<any> {
    return this.http.get(this.profileUrl);
  }
  getAllData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getAddress(): Observable<any> {
    return this.http.get(this.addressUrl);
  }
  
  UpdateAddress (address: any): Observable<[]> {
    return this.http.post<[]>(this.profileUrl, address, httpOptions);
  }

}
