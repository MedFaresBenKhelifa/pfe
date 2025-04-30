import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthToggleService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private isSignedUp = new BehaviorSubject<boolean>(this.loadState('isSignedUp', true));
  private isLoginVisible = new BehaviorSubject<boolean>(this.loadState('isLoginVisible', false));
  private isLoggedIn = new BehaviorSubject<boolean>(this.loadState('isLoggedIn', false));
  private navBar = new BehaviorSubject<boolean>(this.loadState('navBar', false ));

  isSignedUp$ = this.isSignedUp.asObservable();
  isLoginVisible$ = this.isLoginVisible.asObservable();
  isLoggedIn$ = this.isLoggedIn.asObservable();
  navBar$ = this.navBar.asObservable();

  setSignUpVisible(state: boolean) {
    this.saveState('isSignedUp', state);
    this.isSignedUp.next(state);
  }

  setLoginVisible(state: boolean) {
    this.saveState('isLoginVisible', state);
    this.isLoginVisible.next(state);
  }

  setLoggedIn(state: boolean) {
    this.saveState('isLoggedIn', state);
    this.isLoggedIn.next(state);
  }

  setNavBar(state: boolean) {
    this.saveState('navBar', state);
    this.navBar.next(state);
  }

  private loadState(key: string, defaultValue: boolean): boolean {
    if (!this.isBrowser) return defaultValue;

    const stored = localStorage.getItem(key);
    return stored !== null ? JSON.parse(stored) : defaultValue;
  }

  private saveState(key: string, value: boolean): void {
    if (this.isBrowser) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
}
