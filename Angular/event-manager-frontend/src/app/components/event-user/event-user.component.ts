import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { firstValueFrom } from 'rxjs'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-event-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-user.component.html',
  styleUrl: '../../main-layout/main-layout.component.css'
})
export class EventUserComponent implements OnInit {
  events: any[] = [];
  eventDay: string = '';

  constructor(private eventService: EventService, private router: Router, private titleService: Title) { }

  setTitle(newTitle: string) {  
    this.titleService.setTitle(newTitle);  
  } 

  async ngOnInit(): Promise<void> {  
    this.setTitle('Meus Eventos'); // Set the title dynamically  
    try {  
      const data = await firstValueFrom(this.eventService.getUserEvents());  
      this.events = data;  
    } catch (err) {
      console.error(err);  
      this.goToLogin();
    }  
  }

  async deleteEvent(eventId: number): Promise<void> {
    try {  
      await firstValueFrom(this.eventService.deleteEvent(eventId));  
      
      this.goToEventList();
    } catch (err) {  
      console.error(err);  
    }  
  }

  goToUpdateEvent(eventId: number){
    this.navegateTo(eventId, 'events', 'edit');
  }

  navegateTo(param: number, path: string, children: string): void {
    // Navigate to the event details page with the eventId
    if(param == 0){
      this.router.navigate([path]);
    }else{
      this.router.navigate([path, param, children]);
    }
  }

  goToEventList(): void {
    // Navigate to the event details page with the eventId
    this.router.navigate(['/events']);
  }

  goToEventDetails(eventId: number): void {
    // Navigate to the event details page with the eventId
    this.router.navigate(['/events', eventId]);
  }

  goToLogin(){
    // Navigate to the login page
    this.router.navigate(['/login']);
  }
  
  getDay(dateText: string): string {
    const date: Date = new Date(dateText);
    const day = String(date.getDate()).padStart(2, '0');
    // Construct the formatted string
    return day;
  }

  getHourAndMinutes(dateText: string): string {
    const date: Date = new Date(dateText);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Construct the formatted string
    return `${hours}:${minutes}`;
  }

  getMonthName(dateText: string){
    const months: string[] = [
      "Janeiro", "Fevereiro", "Março", "Abril", 
      "Maio", "Junho", "Julho", "Agosto", 
      "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

    const date: Date = new Date(dateText);
    const month: number = date.getMonth();

    return months[  month  ];
  }
}
