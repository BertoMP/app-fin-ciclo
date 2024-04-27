import { TestBed } from '@angular/core/testing';

import { RefreshPasswordService } from './refresh-password.service';

describe('RefreshPasswordService', () => {
  let service: RefreshPasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefreshPasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
