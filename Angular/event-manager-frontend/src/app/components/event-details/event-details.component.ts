import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../services/event.service';
import { firstValueFrom } from 'rxjs'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser'; 
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './event-details.component.html',
  styleUrl: '../../main-layout/main-layout.component.css'
})
export class EventDetailsComponent implements OnInit {
  eventId!: number;
  event = {
    name: '',
    description: '',
    date_time_start: '',
    date_time_end: '',
    location: '',
    organizer: '',
    maximum_capacity: 0,
    tickets_available: 0,
    price: 0,
    status: ''
  };

  constructor(private eventService: EventService, private route: ActivatedRoute, private router: Router, private titleService: Title) { }

  async ngOnInit(): Promise<void> {  
    this.setTitle('Detalhes do Evento'); // Set the title dynamically  

    // Retrieve the eventId from the route parameters
    this.route.params.subscribe(params => {
      this.eventId = +params['eventId']; // Use '+' to convert the param to a number
    });

    try {  
      const response: HttpResponse<any> = await firstValueFrom(this.eventService.getEvent(this.eventId));  
      if(response.ok){
        this.event = response.body;  
      }
    } catch (err) {  
      console.error(err);  
    }  
  }

  setTitle(newTitle: string) {  
    this.titleService.setTitle(newTitle);  
  } 

  async deleteEvent(): Promise<void> {
    try {  
      await firstValueFrom(this.eventService.deleteEvent(this.eventId));  
      
      this.navegateTo(0, '/events', '');
    } catch (err) {  
      console.error(err);  
    }  
  }

  navegateTo(param: number, path: string, children: string): void {
    // Navigate to the event details page with the eventId
    if(param == 0){
      this.router.navigate([path]);
    }else{
      this.router.navigate([path, param, children]);
    }
  }

  goToParticipantList(eventId: number): void {
    // Navega para a rota de participantes do evento com o eventId
    this.router.navigate(['events', eventId, 'participants']);
  }

  goToAddParticipant(eventId: number): void {
    // Navega para a rota de participantes do evento com o eventId
    this.router.navigate(['events', eventId, 'participants', 'new']);
  }
  
}
