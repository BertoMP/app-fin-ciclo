import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalSpecialtiesComponent } from './medical-specialties.component';

describe('MedicalSpecialtiesComponent', () => {
  let component: MedicalSpecialtiesComponent;
  let fixture: ComponentFixture<MedicalSpecialtiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalSpecialtiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedicalSpecialtiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
