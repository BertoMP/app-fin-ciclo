import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoMedicacionComponent } from './listado-medicacion.component';

describe('ListadoMedicacionComponent', () => {
  let component: ListadoMedicacionComponent;
  let fixture: ComponentFixture<ListadoMedicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoMedicacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListadoMedicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
