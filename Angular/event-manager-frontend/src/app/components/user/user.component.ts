import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common'; 
import { Title } from '@angular/platform-browser';   

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './user.component.html',
  styleUrl: '../../login-layout/login-layout.component.css'
})
export class UserComponent implements OnInit {
  authForm!: FormGroup; // Add '!' to indicate this will be initialized later  

  user = {
    username: '',
    password: '',
    email: ''
  };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private titleService: Title,
    private fb: FormBuilder) { }

    ngOnInit(): void {  
      this.setTitle('Formulário de Cadastro'); // Set the title dynamically  
      // Initialize the form  
      this.authForm = this.fb.group({  
        username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],  
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]]  
      });  
    }  
  
    setTitle(newTitle: string) {  
      this.titleService.setTitle(newTitle);  
    } 
    
    async createUser() {  
      try {  
        if (this.authForm.valid) {  
          // Handle the form submission logic  
          const res = await firstValueFrom(this.authService.createUser(this.user));  
          
          localStorage.setItem('auth-token', res.token);  
          this.router.navigate(['/login']);
        } else {  
          // Mark all controls as touched to trigger validation messages  
          this.authForm.markAllAsTouched();  
        }  
      } catch (err) {  
        // Handle error
        console.error('Create User error:', err);
        this.errorMessage = 'Preencha os campos corretamente e tente novamente.';
      }  
    }  
}
