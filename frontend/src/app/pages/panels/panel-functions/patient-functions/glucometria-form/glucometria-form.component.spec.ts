import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlucometriaFormComponent } from './glucometria-form.component';

describe('GlucometriaFormComponent', () => {
  let component: GlucometriaFormComponent;
  let fixture: ComponentFixture<GlucometriaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlucometriaFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GlucometriaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
