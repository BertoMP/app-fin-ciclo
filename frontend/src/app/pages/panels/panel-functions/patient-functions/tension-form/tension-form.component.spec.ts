import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TensionFormComponent } from './tension-form.component';

describe('TensionFormComponent', () => {
  let component: TensionFormComponent;
  let fixture: ComponentFixture<TensionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TensionFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TensionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
