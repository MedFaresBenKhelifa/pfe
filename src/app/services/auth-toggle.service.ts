import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthToggleService {
  private isSignedUp = new BehaviorSubject<boolean>(true); // Initially, Sign Up is visible
  private isLoginVisible = new BehaviorSubject<boolean>(false); // Initially, Log In is hidden
  private isLoggedIn = new BehaviorSubject<boolean>(false); // Initially, Log Out is hidden
  private navBar = new  BehaviorSubject<boolean> (false);

  isSignedUp$ = this.isSignedUp.asObservable();
  isLoginVisible$ = this.isLoginVisible.asObservable();
  isLoggedIn$ = this.isLoggedIn.asObservable();
  navBar$ = this.navBar.asObservable();

  setSignUpVisible(state: boolean) {
    this.isSignedUp.next(state);
  }

  setNavBar(state: boolean) {
    this.navBar.next(state);
  }
  setLoginVisible(state: boolean) {
    this.isLoginVisible.next(state);
  }

  setLoggedIn(state: boolean) {
    this.isLoggedIn.next(state);
  }
}
