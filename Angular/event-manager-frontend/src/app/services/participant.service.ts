import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  private eventManagerApiURL = 'http://localhost:8080/api/events';
  private token = localStorage.getItem('auth-token');

  constructor(private http: HttpClient) { }

  //Get a list of participants for an event
  getAllParticipants(eventId: number): Observable<HttpResponse<any>> {
    if(this.token){
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      return this.http.get<any>(`${this.eventManagerApiURL}/${eventId}/participants`, { headers, observe: 'response' });  
    }else{
      console.error('Token not found in localStorage');
      return throwError(() => new Error('Authorization token is missing')); 
    }
  }

  getUserParticipants(): Observable<HttpResponse<any>> {
    if (this.token) {
       const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
       return this.http.get<any>(`${this.eventManagerApiURL}/participants/user-participants`, { headers, observe: 'response' });  
    } else {
          console.error('Token not found in localStorage');
          return throwError(() => new Error('Authorization token is missing'));  
      }
  }

  //Get an event participant by ID
  getParticipant(eventId: number, participantId: number): Observable<any> {
    if(this.token){
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      return this.http.get(`${this.eventManagerApiURL}/${eventId}/participants/${participantId}`, { headers, observe: 'response' });  
    }else{
      console.error('Token not found in localStorage');
      return throwError(() => new Error('Authorization token is missing')); 
    }
  }

  //Create a new event participant
  createParticipant(eventId: number, participant: any): Observable<HttpResponse<any>> {
    if(this.token){
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      return this.http.post<any>(`${this.eventManagerApiURL}/${eventId}/participants`, participant, { headers, observe: 'response' });
    }else{
      console.error('Token not found in localStorage');
      return throwError(() => new Error('Authorization token is missing')); 
    }
  }

  //Update an existing participant in an event
  updateParticipant(eventId: number, participantId: number, participant: any): Observable<any> {
    if(this.token){
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      return this.http.put(`${this.eventManagerApiURL}/${eventId}/participants/${participantId}`, participant, { headers, observe: 'response' });
    }else{
      console.error('Token not found in localStorage');
      return throwError(() => new Error('Authorization token is missing')); 
    }
  }

  //Delete an existing participant from an event
  deleteParticipant(eventId: number, participantId: number){
    if(this.token){
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      return this.http.delete(`${this.eventManagerApiURL}/${eventId}/participants/${participantId}`, { headers, observe: 'response' });
    }else{
      console.error('Token not found in localStorage');
      return throwError(() => new Error('Authorization token is missing')); 
    }
  }

}
