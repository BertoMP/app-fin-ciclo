import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoMedicionesComponent } from './listado-mediciones.component';

describe('ListadoMedicionesComponent', () => {
  let component: ListadoMedicionesComponent;
  let fixture: ComponentFixture<ListadoMedicionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoMedicionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListadoMedicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
