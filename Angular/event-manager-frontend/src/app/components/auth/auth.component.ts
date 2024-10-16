import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';  
import { CommonModule } from '@angular/common'; 
import { Title } from '@angular/platform-browser'; 

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ FormsModule, ReactiveFormsModule, RouterModule, CommonModule ],
  templateUrl: './auth.component.html',
  styleUrl: '../../login-layout/login-layout.component.css'
})
export class AuthComponent implements OnInit {
  authForm!: FormGroup; // Add '!' to indicate this will be initialized later  

  user = {
    username: '',
    password: ''
  };
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private titleService: Title,
    private fb: FormBuilder) { }

  ngOnInit(): void {  
    this.setTitle('Formulário de Login'); // Set the title dynamically  
    // Initialize the form  
    this.authForm = this.fb.group({  
      username: ['', [Validators.required, Validators.minLength(3)]],  
      password: ['', [Validators.required, Validators.minLength(6)]]  
    });  
  }  

  setTitle(newTitle: string) {  
    this.titleService.setTitle(newTitle);  
  } 

  loginUser() {  
    if (this.authForm.valid) {  
      // Handle the form submission logic  
      firstValueFrom(this.authService.loginUser(this.user))
        .then(res => {
          if (res && res.token) {
            localStorage.setItem('auth-token', res.token);
            // Navigate only after successfully setting the token
            this.router.navigate(['/events']);
          } else {
            throw new Error('Token inválido.');
          }
        })
        .catch(err => {
          // Handle error
          console.error('Login error:', err);
          this.errorMessage = 'Nome de utilizador ou senha inválidos. Por favor, tente novamente.';
        });
    } else {  
      // Mark all controls as touched to trigger validation messages  
      this.authForm.markAllAsTouched();  
    }  
  }  
}
