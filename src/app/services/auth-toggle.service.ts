import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthToggleService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Private subjects with initial state from localStorage or defaults
  private isSignedUpSubject = new BehaviorSubject<boolean>(this.getInitialState('isSignedUp', true));
  private isLoginVisibleSubject = new BehaviorSubject<boolean>(this.getInitialState('isLoginVisible', false));
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.getInitialState('isLoggedIn', false));
  private navBarSubject = new BehaviorSubject<boolean>(this.getInitialState('navBar', false));

  // Public observables
  isSignedUp$ = this.isSignedUpSubject.asObservable();
  isLoginVisible$ = this.isLoginVisibleSubject.asObservable();
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  navBar$ = this.navBarSubject.asObservable();

  // Setter methods
  setSignUpVisible(state: boolean) {
    this.setState('isSignedUp', state, this.isSignedUpSubject);
  }

  setLoginVisible(state: boolean) {
    this.setState('isLoginVisible', state, this.isLoginVisibleSubject);
  }

  setLoggedIn(state: boolean) {
    this.setState('isLoggedIn', state, this.isLoggedInSubject);
  }

  setNavBar(state: boolean) {
    this.setState('navBar', state, this.navBarSubject);
  }

  // Helpers
  private getInitialState(key: string, defaultValue: boolean): boolean {
    if (!this.isBrowser) return defaultValue;
    const stored = localStorage.getItem(key);
    return stored !== null ? JSON.parse(stored) : defaultValue;
  }

  private setState(key: string, value: boolean, subject: BehaviorSubject<boolean>): void {
    if (this.isBrowser) {
      localStorage.setItem(key, JSON.stringify(value));
    }
    subject.next(value);
  }
}
