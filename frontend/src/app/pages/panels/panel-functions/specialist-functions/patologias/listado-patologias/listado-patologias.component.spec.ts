import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPatologiasComponent } from './listado-patologias.component';

describe('ListadoPatologiasComponent', () => {
  let component: ListadoPatologiasComponent;
  let fixture: ComponentFixture<ListadoPatologiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoPatologiasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListadoPatologiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
