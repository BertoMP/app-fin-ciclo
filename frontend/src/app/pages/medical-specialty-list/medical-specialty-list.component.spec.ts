import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalSpecialtyListComponent } from './medical-specialty-list.component';

describe('MedicalSpecialtyListComponent', () => {
  let component: MedicalSpecialtyListComponent;
  let fixture: ComponentFixture<MedicalSpecialtyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalSpecialtyListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedicalSpecialtyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
