import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common'; 
import { Title } from '@angular/platform-browser';   

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, CommonModule ],
  templateUrl: './event-create.component.html',
  styleUrl: '../../main-layout/main-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class EventCreateComponent implements OnInit {
  // Set the minimum to Tommorow and max to a year in the future.
  private token = localStorage.getItem('auth-token');
  minDate: string;
  maxDate: string;

  eventForm!: FormGroup; // Add '!' to indicate this will be initialized later 

  event = {
    name: '',
    description: '',
    date_time_start: '',
    date_time_end: '' ,
    location: '',
    organizer: '',
    maximum_capacity: Number,
    tickets_available: Number,
    price: Number,
  };

  errorMessage: string = '';

  constructor(private eventService: EventService, private router: Router, private titleService: Title, 
    private fb: FormBuilder) { 

      this.minDate = this.formatDate(this.addOneDay(new Date()));
      this.maxDate = this.formatDate(this.addOneYear(new Date()));  // Example minimum date
    }
 
  ngOnInit(): void {  
    this.setTitle('Criar Novo Evento'); // Set the title dynamically  
    // Initialize the form  
    this.eventForm = this.fb.group({  
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],  
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      date_time_start: ['', [Validators.required]],
      date_time_end: ['', [Validators.required]],
      location: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],  
      organizer: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      maximum_capacity: ['', [Validators.min(1), Validators.max(999999)]],
      tickets_available: ['', [Validators.min(1), Validators.max(999999)]],
      price: ['', [Validators.min(0)]]
    });  
  } 
  
  setTitle(newTitle: string) {  
    this.titleService.setTitle(newTitle);  
  } 

  async createEvent() {  
    try {  
      if(!this.token){
        this.router.navigate(['/login']);
      }

      if (this.eventForm.valid) {  
        this.event.date_time_start = this.formatDate(new Date(this.event.date_time_start))
        this.event.date_time_end = this.formatDate(new Date(this.event.date_time_end))
        // Handle the form submission logic  
        await firstValueFrom(this.eventService.createEvent(this.event));  
        this.router.navigate(['/events']);
      } else {  
        // Mark all controls as touched to trigger validation messages  
        this.eventForm.markAllAsTouched();  
      }  
    } catch (err) {  
      console.error('Create User error:', err);
      this.errorMessage = 'Preencha os campos corretamente e tente novamente.';
    }  
  } 
  
  private formatDate(date: Date): string {
    // Get components of the date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Construct the formatted string
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  private addOneDay(date: Date): Date {
    // Add 1 day to the current date
    date.setDate(date.getDate() + 1);
    return date;
  }

  private addOneYear(date: Date): Date {
    // Add 1 year to the current date
    date.setFullYear(date.getFullYear() + 1);
    return date;
  }
}
