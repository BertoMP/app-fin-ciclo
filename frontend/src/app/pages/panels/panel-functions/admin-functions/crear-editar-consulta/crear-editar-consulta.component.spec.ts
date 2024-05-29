import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarConsultaComponent } from './crear-editar-consulta.component';

describe('CrearEditarConsultaComponent', () => {
  let component: CrearEditarConsultaComponent;
  let fixture: ComponentFixture<CrearEditarConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEditarConsultaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearEditarConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
