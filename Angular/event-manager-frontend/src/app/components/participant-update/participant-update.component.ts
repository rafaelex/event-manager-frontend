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
  selector: 'app-participant-update',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, CommonModule ],
  templateUrl: './participant-update.component.html',
  styleUrl: '../../main-layout/main-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantUpdateComponent implements OnInit {
  private token = localStorage.getItem('auth-token');

  eventName: string = '';
  eventTicketsAvailable: number = 1;
  eventId!: number;
  participantId!: number;
  documentTypes: string[] = [
    'Bilhete de Identidade',
    'Certidão de Nascimento', 
    'Carta de Condução', 
    'Cartão de Eleitor', 
    'Cartão de Identificação Tributaria', 
    'Cartão Militar', 
    'Cédula Pessoal', 
    'DIRE',
    'Passport'
  ];
  
  errorMessage: string = '';
  participantForm!: FormGroup; // Add '!' to indicate this will be initialized later 

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

  constructor(private eventService: EventService, private participantService: ParticipantService, private router: Router, private route: ActivatedRoute, private titleService: Title, 
    private fb: FormBuilder) { 
  }

  async ngOnInit(): Promise<void> {
    this.setTitle('Editar Participante'); // Set the title dynamically  

    // Retrieve the eventId from the route parameters
    this.route.params.subscribe(params => {
      this.eventId = +params['eventId']; // Use '+' to convert the param to a number
      this.participantId = +params['participantId']; // Use '+' to convert the param to a number
    });

    // Initialize the form  
    this.participantForm = this.fb.group({  
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],  
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],  
      id_document_type: ['', [Validators.required]],
      id_document_number: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      confirmed_presence: ['', [Validators.required]],  
      tickets_purchased: ['', [Validators.required, Validators.min(0), Validators.max(this.eventTicketsAvailable)]]
    });

    // Busca os dados do evento com base no eventId
    this.participantService.getParticipant(this.eventId, this.participantId).subscribe((response) => {
      // Preenche o formulário com os dados do evento
      if(response.ok){
        this.eventName = response.body.event.name;
        this.eventTicketsAvailable = 1;

        this.participantForm.patchValue({
          name: response.body.name,
          email: response.body.email,
          id_document_type: response.body.id_document_type,
          id_document_number: response.body.id_document_number,
          confirmed_presence: response.body.confirmed_presence,
          tickets_purchased: response.body.tickets_purchased,
          event: response.body.event
          });
      }
    });
  }

  setTitle(newTitle: string) {  
    this.titleService.setTitle(newTitle);  
  }

  async updateParticipant() {  
    try {  
      if(!this.token){
        this.router.navigate(['/login']);
      }

      if (this.participantForm.valid) {  
        this.participant = this.participantForm.value;
        
        const res = await firstValueFrom(this.participantService.updateParticipant(this.eventId, this.participantId, this.participant));  
        this.router.navigate(['/events/participants/user-participants']);
      } else {  
        // Mark all controls as touched to trigger validation messages  
        this.participantForm.markAllAsTouched();  
      }  

    } catch (err) {  
      // Handle error
      console.error('Update User error:', err);
      this.errorMessage = 'Preencha os campos corretamente e tente novamente.';
    }  
  }

}
