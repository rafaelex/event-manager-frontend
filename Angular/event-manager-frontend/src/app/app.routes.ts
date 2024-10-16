import { NgModule } from '@angular/core';  
import { RouterModule, Routes  } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { AuthComponent } from './components/auth/auth.component';
import { UserComponent } from './components/user/user.component';
import { EventComponent } from './components/event/event.component';
import { EventCreateComponent } from './components/event-create/event-create.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { ParticipantComponent } from './components/participant/participant.component';
import { EventUserComponent } from './components/event-user/event-user.component';
import { EventUpdateComponent } from './components/event-update/event-update.component';
import { ParticipantCreateComponent } from './components/participant-create/participant-create.component';
import { ParticipantUserComponent } from './components/participant-user/participant-user.component';
import { ParticipantUpdateComponent } from './components/participant-update/participant-update.component';
import { ParticipantDetailsComponent } from './components/participant-details/participant-details.component';

export const routes: Routes = [
    {
      path:'', 
      component: LoginLayoutComponent,
      children: [
        { path: '', redirectTo: 'login', pathMatch: 'full' },    
        { path: 'login', component: AuthComponent, data: { title: '' } },
        { path: 'signup', component: UserComponent, data: { title: '' } }
      ]
    },
    {
      path:'events',
      component: MainLayoutComponent,
      children: [
        { path: '', component: EventComponent, data: { title: '' } },
        { path: 'user-events', component: EventUserComponent, data: { title: '' } },
        { path: 'create', component: EventCreateComponent, data: { title: '' } },
        { path: ':eventId', component: EventDetailsComponent, data: { title: '' } },
        { path: ':eventId/edit', component: EventUpdateComponent, data: { title: '' } },
        { path: ':eventId/participants', component: ParticipantComponent, data: { title: '' } },
        { path: ':eventId/participants/new', component: ParticipantCreateComponent, data: { title: '' } },
        { path: ':eventId/participants/:participantId', component: ParticipantUpdateComponent, data: { title: '' } },
        { path: ':eventId/participants/:participantId/details', component: ParticipantDetailsComponent, data: { title: '' } },
        { path: 'participants/user-participants', component: ParticipantUserComponent, data: { title: '' } },
        { path: '**', redirectTo: 'login', data: { title: '' }  } // Rota curinga para redirecionar quaisquer URLs inválidos
      ]
    }
  ];

