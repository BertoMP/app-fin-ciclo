import { TestBed } from '@angular/core/testing';

import { PatologiasService } from './patologias.service';

describe('PatologiasService', () => {
  let service: PatologiasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatologiasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
