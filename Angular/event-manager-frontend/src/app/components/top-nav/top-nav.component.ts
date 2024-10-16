import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [ RouterModule, CommonModule ],
  templateUrl: './top-nav.component.html',
  styleUrl: '../../main-layout/main-layout.component.css'
})
export class TopNavComponent {

  constructor(private router: Router) { 

    }

  toggleSidebar() {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    sidebar.classList.toggle('active');
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
