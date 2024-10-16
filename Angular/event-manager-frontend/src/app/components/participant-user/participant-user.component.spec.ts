import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantUserComponent } from './participant-user.component';

describe('ParticipantUserComponent', () => {
  let component: ParticipantUserComponent;
  let fixture: ComponentFixture<ParticipantUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
