import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoAgendaComponent } from './listado-agenda.component';

describe('ListadoAgendaComponent', () => {
  let component: ListadoAgendaComponent;
  let fixture: ComponentFixture<ListadoAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoAgendaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListadoAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
