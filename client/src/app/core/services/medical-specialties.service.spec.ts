import { TestBed } from '@angular/core/testing';

import { MedicalSpecialtiesService } from './medical-specialties.service';

describe('MedicalSpecialitiesService', () => {
  let service: MedicalSpecialtiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicalSpecialtiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
