import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalServicesComponent } from './medical-services.component';

describe('MedicalSpecialtiesComponent', () => {
  let component: MedicalServicesComponent;
  let fixture: ComponentFixture<MedicalServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
