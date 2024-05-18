import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoInformesComponent } from './listado-informes.component';

describe('ListadoInformesComponent', () => {
  let component: ListadoInformesComponent;
  let fixture: ComponentFixture<ListadoInformesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoInformesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListadoInformesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
