import { TestBed } from '@angular/core/testing';

import { MedicalSpecialistListService } from './medical-specialist-list.service';

describe('MedicalSpecialistListService', () => {
  let service: MedicalSpecialistListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicalSpecialistListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
