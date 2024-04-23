import { TestBed } from '@angular/core/testing';

import { TesteoBackendService } from './testeo-backend.service';

describe('TesteoBackendService', () => {
  let service: TesteoBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TesteoBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
