import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoMedicamentosComponent } from './listado-medicamentos.component';

describe('ListadoMedicamentosComponent', () => {
  let component: ListadoMedicamentosComponent;
  let fixture: ComponentFixture<ListadoMedicamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoMedicamentosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListadoMedicamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
