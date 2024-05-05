import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspecialistPanelComponent } from './especialist-panel.component';

describe('EspecialistPanelComponent', () => {
  let component: EspecialistPanelComponent;
  let fixture: ComponentFixture<EspecialistPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EspecialistPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EspecialistPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
