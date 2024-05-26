import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarPatologiasComponent } from './crear-editar-patologias.component';

describe('CrearEditarPatologiasComponent', () => {
  let component: CrearEditarPatologiasComponent;
  let fixture: ComponentFixture<CrearEditarPatologiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEditarPatologiasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearEditarPatologiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
