import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthToggleService {
  private isSignedUp = new BehaviorSubject<boolean>(true); // Initially, Sign Up is visible
  private isLoginVisible = new BehaviorSubject<boolean>(false); // Initially, Log In is hidden
  private isLoggedIn = new BehaviorSubject<boolean>(false); // Initially, Log Out is hidden

  isSignedUp$ = this.isSignedUp.asObservable();
  isLoginVisible$ = this.isLoginVisible.asObservable();
  isLoggedIn$ = this.isLoggedIn.asObservable();

  setSignUpVisible(state: boolean) {
    this.isSignedUp.next(state);
  }

  setLoginVisible(state: boolean) {
    this.isLoginVisible.next(state);
  }

  setLoggedIn(state: boolean) {
    this.isLoggedIn.next(state);
  }
}
