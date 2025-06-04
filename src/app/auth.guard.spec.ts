import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthToggleService } from './services/auth-toggle.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerSpy = { createUrlTree: jasmine.createSpy('createUrlTree') };
  let authToggleServiceSpy = jasmine.createSpyObj('AuthToggleService', ['setLoginVisible', 'setNavBar']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerSpy },
        { provide: AuthToggleService, useValue: authToggleServiceSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should allow activation if user is logged in', () => {
    localStorage.setItem('isLoggedIn', 'true');
    expect(guard.canActivate()).toBeTrue();
  });

  it('should redirect to login if user is not logged in', () => {
    localStorage.removeItem('isLoggedIn');
    const result = guard.canActivate();
    expect(authToggleServiceSpy.setLoginVisible).toHaveBeenCalledWith(true);
    expect(authToggleServiceSpy.setNavBar).toHaveBeenCalledWith(false);
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/LogIn']);
    expect(result).toBe(routerSpy.createUrlTree.calls.mostRecent().returnValue);
  });
});
