import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userApiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  loginUser(user: any): Observable<any> {
    return this.http.post(`${this.userApiUrl}/authenticate`, user);
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${this.userApiUrl}/create`, user);
  }
}
