import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class MonitoringService {
  private intervalId: any;
  public currentTemperatures: number[] = [];
  public currentGasLevels: number[] = [];

  constructor(private toastService: ToastService) {
    this.startMonitoring();
  }

  startMonitoring() {
    this.currentTemperatures = this.generateRandomTemperatures();
    this.currentGasLevels = this.generateRandomGasLevels();

    this.intervalId = setInterval(() => {
      // First update data
      this.updateDataArrays();
      
      // Then trigger toasts after a small delay
      setTimeout(() => this.checkAlerts(), 50);
    }, 10000);
  }

  private updateDataArrays() {
    this.currentTemperatures.shift();
    const newTemp = Number((Math.random() * 10 + 20).toFixed(1));
    this.currentTemperatures.push(newTemp);

    this.currentGasLevels.shift();
    const newGas = Math.floor(Math.random() * 300 + 100);
    this.currentGasLevels.push(newGas);
  }

  private checkAlerts() {
    const latestTemp = this.currentTemperatures.slice(-1)[0];
    const latestGas = this.currentGasLevels.slice(-1)[0];

    if (latestTemp > 20) {
      this.toastService.triggerTempToast();
    }
    if (latestGas > 200) {
      this.toastService.triggerHighGasToast();
    }
  }

  private generateRandomTemperatures(): number[] {
    return Array(6).fill(0).map(() => Number((Math.random() * 10 + 20).toFixed(1)));
  }

  private generateRandomGasLevels(): number[] {
    return Array(6).fill(0).map(() => Math.floor(Math.random() * 300 + 100));
  }
}