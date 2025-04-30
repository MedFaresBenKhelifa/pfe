// toast.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private showTempToastSubject = new BehaviorSubject<boolean>(false);
  private showHighGasToastSubject = new BehaviorSubject<boolean>(false);
  private enabled = true; // Control flag

  // Public observables
  showTempToast$ = this.showTempToastSubject.asObservable();
  showHighGasToast$ = this.showHighGasToastSubject.asObservable();

  // New method to control visibility
  setEnabled(state: boolean): void {
    this.enabled = state;
    if (!state) {
      this.hideAllToasts();
    }
  }

  triggerTempToast(): void {
    if (this.enabled) {
      this.showTempToastSubject.next(true);
      setTimeout(() => this.showTempToastSubject.next(false), 8000);
    }
  }

  triggerHighGasToast(): void {
    if (this.enabled) {
      this.showHighGasToastSubject.next(true);
      setTimeout(() => this.showHighGasToastSubject.next(false), 8000);
    }
  }
  dismissTemp() {
    this.showTempToastSubject.next(false);
  }

  dismissGas() {
    this.showHighGasToastSubject.next(false);
  }
  private hideAllToasts(): void {
    this.showTempToastSubject.next(false);
    this.showHighGasToastSubject.next(false);
  }
}