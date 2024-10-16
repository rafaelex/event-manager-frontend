import { Component, OnInit, LOCALE_ID, NgModule } from '@angular/core';
import { RouterOutlet, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { Title } from '@angular/platform-browser';  
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt' }  // Define o idioma para Português
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(private titleService: Title, private route: ActivatedRoute) {}  

  ngOnInit(): void {  
    this.route.data.subscribe(data => {  
      const title = data['title'] ? data['title'] : 'Event Manager App';  
      this.titleService.setTitle(title);  
    });  
  }  
  
  title = 'event-manager-frontend';
}

// Bootstrapping the application
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes)
  ]
}).catch(err => console.error(err));