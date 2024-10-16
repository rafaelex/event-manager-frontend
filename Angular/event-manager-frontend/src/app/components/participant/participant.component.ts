import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { ParticipantService } from '../../services/participant.service';
import { firstValueFrom } from 'rxjs'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser'; 
import { HttpResponse } from '@angular/common/http';  // Importar HttpResponse


@Component({
  selector: 'app-participant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './participant.component.html',
  styleUrl: '../../main-layout/main-layout.component.css'
})
export class ParticipantComponent implements OnInit {
  event!: any;
  eventName: string = '';
  participants: any[] = [];
  eventId!: number;

  constructor(private eventService: EventService, private participantService: ParticipantService, private route: ActivatedRoute, private router: Router, private titleService: Title) { }

  setTitle(newTitle: string) {  
    this.titleService.setTitle(newTitle);  
  } 

  selectedIndex: number | null = null;

  selectItem(index: number) {
    this.selectedIndex = index;
  }

  async ngOnInit(): Promise<void> {  
    this.setTitle('Lista de Participantes'); // Set the title dynamically  

    // Retrieve the eventId from the route parameters
    this.route.params.subscribe(params => {
      this.eventId = +params['eventId']; // Use '+' to convert the param to a number
    });

    try {  
      const eventDataResponse: HttpResponse<any>  = await firstValueFrom(this.eventService.getEvent(this.eventId)); 
      this.event = eventDataResponse.body;
      
      if(this.event != null){
        this.eventName = this.event.name;
        
        // Obter a resposta completa da API
        const participantsResponse: HttpResponse<any> = await firstValueFrom(this.participantService.getAllParticipants(this.eventId));

        // Acessar o corpo da resposta (dados do evento)
        this.participants = participantsResponse.body;
      }
      
    } catch (err) {
      console.error(err);  
      this.goToLogin();
    }  
  }  

  async getEvent(): Promise<void> {  
    // Retrieve the eventId from the route parameters
    this.route.params.subscribe(params => {
      this.eventId = +params['eventId']; // Use '+' to convert the param to a number
    });
    
    try {  
      const data = await firstValueFrom(this.eventService.getEvent(this.eventId));  
      this.event = data;  
    } catch (err) {  
      console.error(err);  
    }  
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

  getYear(dateText: string): string {
    const date: Date = new Date(dateText);
    
    return date.getFullYear().toString();
  }
}
