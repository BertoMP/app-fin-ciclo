import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarTomasComponent } from './crear-editar-tomas.component';

describe('CrearEditarTomasComponent', () => {
  let component: CrearEditarTomasComponent;
  let fixture: ComponentFixture<CrearEditarTomasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearEditarTomasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearEditarTomasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
