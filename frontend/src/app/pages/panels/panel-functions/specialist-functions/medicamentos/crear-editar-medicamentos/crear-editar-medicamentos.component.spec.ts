import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarMedicamentosComponent } from './crear-editar-medicamentos.component';

describe('CrearEditarMedicamentosComponent', () => {
  let component: CrearEditarMedicamentosComponent;
  let fixture: ComponentFixture<CrearEditarMedicamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEditarMedicamentosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearEditarMedicamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
