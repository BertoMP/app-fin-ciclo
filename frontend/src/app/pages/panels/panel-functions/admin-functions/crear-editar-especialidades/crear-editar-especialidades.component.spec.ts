import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarEspecialidadesComponent } from './crear-editar-especialidades.component';

describe('CrearEditarEspecialidadesComponent', () => {
  let component: CrearEditarEspecialidadesComponent;
  let fixture: ComponentFixture<CrearEditarEspecialidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEditarEspecialidadesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearEditarEspecialidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
