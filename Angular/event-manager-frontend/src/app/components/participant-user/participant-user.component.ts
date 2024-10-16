import { Component, OnInit } from '@angular/core';
import { ParticipantService } from '../../services/participant.service';
import { firstValueFrom } from 'rxjs'; 
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-participant-user',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './participant-user.component.html',
  styleUrl: '../../main-layout/main-layout.component.css'
})
export class ParticipantUserComponent implements OnInit {
  participants: any[] = [];

  constructor(private participantService: ParticipantService, private router: Router, private titleService: Title) { }

  setTitle(newTitle: string) {  
    this.titleService.setTitle(newTitle);  
  }

  selectedIndex: number = 0 //| null = null;

  selectItem(index: number) {
    this.selectedIndex = index;
  }

  async ngOnInit(): Promise<void> {  
    this.setTitle('Minhas Participações'); // Set the title dynamically  
      
    this.getParticipants();
  }

  async getParticipants() {
    try {  
      const response = await firstValueFrom(this.participantService.getUserParticipants());  
      
      if(response.ok){
        this.participants = response.body;  
      }
    } catch (err) {
      console.error(err);  
      this.goToLogin();
    }
  }

  async deleteParticipant(eventId: number, participantId: number): Promise<void> {
    try {  
      await firstValueFrom(this.participantService.deleteParticipant(eventId, participantId));  
      this.getParticipants();
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

  goToUserParticipantList(): void {
    this.router.navigate(['/events/participants/user-participants']);
  }

  goToEventDetails(eventId: number): void {
    this.router.navigate(['/events', eventId]);
  }

  goToParticipantEdit(eventId: number, participantId: number): void {
    this.router.navigate(['events', eventId, 'participants', participantId]);
  }

  goToParticipantDetails(eventId: number, participantId: number): void {
    this.router.navigate(['events', eventId, 'participants', participantId, 'details']);
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
