import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspecialistDataComponent } from './especialist-data.component';

describe('EspecialistDataComponent', () => {
  let component: EspecialistDataComponent;
  let fixture: ComponentFixture<EspecialistDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspecialistDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EspecialistDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
