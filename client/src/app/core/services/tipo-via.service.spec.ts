import { TestBed } from '@angular/core/testing';

import { TipoViaService } from './tipo-via.service';

describe('TipoViaService', () => {
  let service: TipoViaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoViaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
