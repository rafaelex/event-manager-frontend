import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { ParticipantService } from '../../services/participant.service';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common'; 
import { Title } from '@angular/platform-browser';  
import { HttpResponse } from '@angular/common/http';  

@Component({
  selector: 'app-participant-create',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, CommonModule ],
  templateUrl: './participant-create.component.html',
  styleUrl: '../../main-layout/main-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ParticipantCreateComponent implements OnInit {
  // Set the minimum to Tommorow and max to a year in the future.
  private token = localStorage.getItem('auth-token');
  event!: any;
  eventName: string = '';
  eventTicketsAvailable: number = 1;
  eventId!: number;
  documentTypes: string[] = [
    'Bilhete de Identidade',
    'Certidão de Nascimento', 
    'Carta de Condução', 
    'Cartão de Eleitor', 
    'Cartão de Identificação Tributaria', 
    'Cartão Militar', 
    'Cédula Pessoal', 
    'DIRE'
  ];
  
  errorMessage: string = '';
  participantForm!: FormGroup; // Add '!' to indicate this will be initialized later 

  participant = {
    name: '',
    email: '',
    id_document_type: '',
    id_document_number: '' ,
    confirmed_presence: false,
    tickets_purchased: Number
  };

  constructor(private eventService: EventService, private participantService: ParticipantService, private router: Router, private route: ActivatedRoute, private titleService: Title, 
    private fb: FormBuilder) { 
    }

  async ngOnInit(): Promise<void> {
    this.setTitle('Formulário do Participante'); // Set the title dynamically  

    // Retrieve the eventId from the route parameters
    this.route.params.subscribe(params => {
      this.eventId = +params['eventId']; // Use '+' to convert the param to a number
    });

    const eventDataResponse: HttpResponse<any>  = await firstValueFrom(this.eventService.getEvent(this.eventId)); 
    this.event = eventDataResponse.body;
      
    if(this.event != null){
      this.eventName = this.event.name;
      this.eventTicketsAvailable = 1;
    }

    // Initialize the form  
    this.participantForm = this.fb.group({  
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],  
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],  
      id_document_type: ['', [Validators.required]],
      id_document_number: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      confirmed_presence: ['', [Validators.required]],  
      tickets_purchased: ['', [Validators.required, Validators.min(0), Validators.max(this.eventTicketsAvailable)]]
    });
  }

  setTitle(newTitle: string) {  
    this.titleService.setTitle(newTitle);  
  }

  async createParticipant() {  
    try {  
      if(!this.token){
        this.router.navigate(['/login']);
      }
      
      if (this.participantForm.valid) {  
        //Handle the form submission logic  
        await firstValueFrom(this.participantService.createParticipant(this.eventId, this.participant));  
        this.goToParticipantList(this.eventId);
      } else {  
        // Mark all controls as touched to trigger validation messages  
        this.participantForm.markAllAsTouched();  
      }  
    } catch (err) {  
      console.error('Create Participant error:', err);
      this.errorMessage = 'Preencha os campos corretamente e tente novamente.';
    }  
  }

  goToParticipantList(eventId: number): void {
    // Navega para a rota de participantes do evento com o eventId
    this.router.navigate(['events', eventId, 'participants']);
  }
}
