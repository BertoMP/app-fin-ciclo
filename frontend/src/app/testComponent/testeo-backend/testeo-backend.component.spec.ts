import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TesteoBackendComponent } from './testeo-backend.component';

describe('TesteoBackendComponent', () => {
  let component: TesteoBackendComponent;
  let fixture: ComponentFixture<TesteoBackendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TesteoBackendComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TesteoBackendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
