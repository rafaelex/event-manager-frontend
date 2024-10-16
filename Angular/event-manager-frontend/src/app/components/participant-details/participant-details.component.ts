import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParticipantService } from '../../services/participant.service';
import { firstValueFrom } from 'rxjs'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser'; 
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-participant-details',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './participant-details.component.html',
  styleUrl: '../../main-layout/main-layout.component.css'
})
export class ParticipantDetailsComponent implements OnInit {
  eventId!: number;
  participantId!: number;

  participant = {
    name: '',
    email: '',
    id_document_type: '',
    id_document_number: '' ,
    confirmed_presence: false,
    tickets_purchased: Number,
    event: {
      name: '',
      description: '',
      date_time_start: '',
      date_time_end: '' ,
      location: '',
      organizer: '',
      maximum_capacity: Number,
      tickets_available: Number,
      price: Number,
    }
  };

  constructor(private participantService: ParticipantService, private route: ActivatedRoute, private router: Router, private titleService: Title) { }

  async ngOnInit(): Promise<void> {  
    this.setTitle('Detalhes do Participante'); // Set the title dynamically  

    // Retrieve the eventId from the route parameters
    this.route.params.subscribe(params => {
      this.eventId = +params['eventId']; // Use '+' to convert the param to a number
      this.participantId = +params['participantId']; // Use '+' to convert the param to a number
    });

    try {  
      const response: HttpResponse<any> = await firstValueFrom(this.participantService.getParticipant(this.eventId, this.participantId));  
      if(response.ok){
        this.participant = response.body;  
      }
    } catch (err) {  
      console.error(err);  
    }  
  }

  setTitle(newTitle: string) {  
    this.titleService.setTitle(newTitle);  
  } 

  async deleteParticipant(eventId: number, participantId: number): Promise<void> {
    try {  
      await firstValueFrom(this.participantService.deleteParticipant(eventId, participantId));  
      this.goToUserParticipantList();
    } catch (err) {  
      console.error(err);  
    }  
  }

  goToParticipantEdit(eventId: number, participantId: number): void {
    this.router.navigate(['events', eventId, 'participants', participantId]);
  }

  goToUserParticipantList(): void {
    this.router.navigate(['/events/participants/user-participants']);
  }


  navegateTo(param: number, path: string, children: string): void {
    // Navigate to the event details page with the eventId
    if(param == 0){
      this.router.navigate([path]);
    }else{
      this.router.navigate([path, param, children]);
    }
  }
}
