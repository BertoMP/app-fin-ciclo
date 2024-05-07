import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoGlucometriaComponent } from './listado-glucometria.component';

describe('ListadoGlucometriaComponent', () => {
  let component: ListadoGlucometriaComponent;
  let fixture: ComponentFixture<ListadoGlucometriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoGlucometriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListadoGlucometriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
