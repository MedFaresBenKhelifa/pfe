import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private showTempToastSubject = new BehaviorSubject<boolean>(false);
  private showHighGasToastSubject = new BehaviorSubject<boolean>(false);
  private showUnknownToastSubject = new BehaviorSubject<boolean>(false);
  private genericMessageSubject = new BehaviorSubject<string | null>(null);
  private enabled = true;

  // Public observables
  showTempToast$ = this.showTempToastSubject.asObservable();
  showHighGasToast$ = this.showHighGasToastSubject.asObservable();
  showUnknownToast$ = this.showUnknownToastSubject.asObservable();
  genericMessage$ = this.genericMessageSubject.asObservable();

  // Enable or disable all toasts
  setEnabled(state: boolean): void {
    this.enabled = state;
    if (!state) this.hideAllToasts();
  }

  // Trigger temperature warning toast
  triggerTempToast(): void {
    if (this.enabled) {
      this.showTempToastSubject.next(true);
      setTimeout(() => this.showTempToastSubject.next(false), 8000);
    }
  }

  // Trigger high gas warning toast
  triggerHighGasToast(): void {
    if (this.enabled) {
      this.showHighGasToastSubject.next(true);
      setTimeout(() => this.showHighGasToastSubject.next(false), 8000);
    }
  }

  // Trigger unknown person toast
  triggerUnknownToast(): void {
    if (this.enabled) {
      this.showUnknownToastSubject.next(true);
      setTimeout(() => this.showUnknownToastSubject.next(false), 8000);
    }
  }

  // Show custom message toast
  showGenericMessage(message: string): void {
    if (this.enabled) {
      this.genericMessageSubject.next(message);
      setTimeout(() => this.genericMessageSubject.next(null), 8000);
    }
  }

  // Manual dismissal methods
  dismissTemp(): void {
    this.showTempToastSubject.next(false);
  }

  dismissGas(): void {
    this.showHighGasToastSubject.next(false);
  }

  dismissUnknown(): void {
    this.showUnknownToastSubject.next(false);
  }

  dismissGeneric(): void {
    this.genericMessageSubject.next(null);
  }

  // Hide everything
  private hideAllToasts(): void {
    this.dismissTemp();
    this.dismissGas();
    this.dismissUnknown();
    this.dismissGeneric();
  }
}
