import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [ RouterModule, CommonModule ],
  templateUrl: './sidebar.component.html',
  styleUrl: '../../main-layout/main-layout.component.css'
})
export class SidebarComponent {

}
