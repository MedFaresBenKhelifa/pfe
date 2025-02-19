import { TestBed } from '@angular/core/testing';

import { AuthToggleService } from './auth-toggle.service';

describe('AuthToggleService', () => {
  let service: AuthToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthToggleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
