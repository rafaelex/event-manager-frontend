import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private eventManagerApiURL = 'http://localhost:8080/api/events';
  private token = localStorage.getItem('auth-token');

  constructor(private http: HttpClient) { }

  //Get a list of events

  getEvents(): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<any>(`${this.eventManagerApiURL}`, { headers, observe: 'response' });
  }
  
  getUserEvents(): Observable<any> {
    if (this.token) {
       const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
       return this.http.get(`${this.eventManagerApiURL}/user-events`, { headers });
    } else {
          console.error('Token not found in localStorage');
          return throwError(() => new Error('Authorization token is missing'));  
      }
  }

  //Get an event by ID
  getEvent(id: number): Observable<HttpResponse<any>>  {
    if(this.token){
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      return this.http.get(`${this.eventManagerApiURL}/${id}`, { headers, observe: 'response' });
    }else{
        console.error('Token not found in localStorage');
        return throwError(() => new Error('Authorization token is missing')); 
    }
  }

  //Create a new event
  createEvent(event: any): Observable<any> {
    if(this.token){
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

      return this.http.post(this.eventManagerApiURL, event, { headers })
    }else{
      return throwError(() => new Error('Authorization token is missing')); 
    }    
  }

  //Update an existing event
  updateEvent(id: number, event: any): Observable<any> {
    if(this.token){
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      return this.http.put(`${this.eventManagerApiURL}/${id}`, event, { headers });
    }else{
      console.error('Token not found in localStorage');
      return throwError(() => new Error('Authorization token is missing')); 
    }
  }
 
  //Delete an existing event
  deleteEvent(id: number): Observable<any> {
    if(this.token){
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      return this.http.delete(`${this.eventManagerApiURL}/${id}`, { headers });  
    }else{
      console.error('Token not found in localStorage');
      return throwError(() => new Error('Authorization token is missing')); 
    }
  }

}
