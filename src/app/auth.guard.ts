import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthToggleService } from './services/auth-toggle.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authToggleService: AuthToggleService, private router: Router) {}

  canActivate():
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const isLoggedIn =
      localStorage.getItem('isLoggedIn') === 'true' ||
      sessionStorage.getItem('isLoggedIn') === 'true';

    if (token && isLoggedIn) {
      return true;
    } else {
      this.authToggleService.setLoginVisible(true);
      this.authToggleService.setNavBar(false);
      return this.router.createUrlTree(['/LogIn']);
    }
  }
}
