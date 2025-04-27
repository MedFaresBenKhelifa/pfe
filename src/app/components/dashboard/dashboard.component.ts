import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild, ElementRef, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('temperatureCanvas') temperatureCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('gasCanvas') gasCanvas!: ElementRef<HTMLCanvasElement>;

  temperatureChart: Chart | null = null;
  gasChart: Chart | null = null;
  private intervalId: any;
  private platformId = inject(PLATFORM_ID);
  private currentTemperatures: number[] = [];
  private currentGasLevels: number[] = [];

  // Toast controls
  showTempToast: boolean = false;
  showHighGasToast: boolean = false;
  showLowO2Toast: boolean = false;

  ngOnInit() {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {this.renderTemperatureChart();
      this.renderCO2Chart();
      this.intervalId = setInterval(() => {
        this.updateChartsRealTime();
      }, 10000); // update every 10 seconds
    }
  }

  ngOnDestroy() {

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  renderTemperatureChart() {









    if (this.temperatureChart) {
      this.temperatureChart.destroy();
    }

    const ctx = this.temperatureCanvas?.nativeElement.getContext('2d');
    if (!ctx) return;

    this.currentTemperatures = this.generateRandomTemperatures();

    this.temperatureChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.generateHourLabels(),
        datasets: [{
          label: 'Température (°C)',
          data: this.currentTemperatures,
          borderColor: 'rgb(162, 5, 26)',
          backgroundColor: 'rgba(162, 5, 26, 0.3)',
          fill: true
        }]
      },
      options: { responsive: true }
    });
  }

  renderCO2Chart() {
    if (this.gasChart) {
      this.gasChart.destroy();
    }

    const ctx = this.gasCanvas?.nativeElement.getContext('2d');
    if (!ctx) return;

    this.currentGasLevels = this.generateRandomGasLevels();

    this.gasChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.generateHourLabels(),
        datasets: [{
          label: 'Niveaux de Gaz (CO₂ ppm)',
          data: this.currentGasLevels,
          backgroundColor: 'blue'
        }]
      },
      options: { responsive: true }
    });
  }

  updateChartsRealTime() {
    // Shift and push new temperature
    if (this.currentTemperatures.length > 0) {
      this.currentTemperatures.shift();
      this.currentTemperatures.push(Number((Math.random() * 10 + 20).toFixed(1)));
    }
  
    // Shift and push new gas level
    if (this.currentGasLevels.length > 0) {
      this.currentGasLevels.shift();
      this.currentGasLevels.push(Math.floor(Math.random() * 300 + 100));
    }
  
    // Update temperature chart
    if (this.temperatureChart && this.temperatureChart.data.datasets[0]) {
      this.temperatureChart.data.datasets[0].data = this.currentTemperatures;
      this.temperatureChart.update();
  
      const latestTemp = this.currentTemperatures[this.currentTemperatures.length - 1];
      if (latestTemp > 20) {
        this.triggerTempToast();
      }
    }
  
    // Update gas chart
    if (this.gasChart && this.gasChart.data.datasets[0]) {
      this.gasChart.data.datasets[0].data = this.currentGasLevels;
      this.gasChart.update();
  
      const latestGasLevel = this.currentGasLevels[this.currentGasLevels.length - 1];
      if (latestGasLevel > 200) {
        this.triggerHighGasToast();
      }
    }
  }
  

  triggerTempToast() {
    this.showTempToast = true;
    setTimeout(() => {
      this.showTempToast = false;
    }, 8000);
  }

  
  triggerHighGasToast() {
    this.showHighGasToast = true;
    setTimeout(() => {
      this.showHighGasToast = false;
    }, 8000);
  }
  


  generateRandomTemperatures(): number[] {
    const temps: number[] = [];
    for (let i = 0; i < 6; i++) {
      temps.push(Number((Math.random() * 10 + 20).toFixed(1)));
    }
    return temps;
  }

  generateHourLabels(): string[] {
    const labels: string[] = [];
    const now = new Date();
    let currentHour = now.getHours();
  
    for (let i = 0; i < 6; i++) {
      let hour = (currentHour - i + 24) % 24;
      let period = hour >= 12 ? 'PM' : 'AM';
      let displayHour = hour % 12;
      if (displayHour === 0) displayHour = 12;
      labels.push(`${displayHour}${period}`);
    }
  
    return labels.reverse();
  }

  generateRandomGasLevels(): number[] {
    const gases: number[] = [];
    for (let i = 0; i < 6; i++) {
      gases.push(Math.floor(Math.random() * 300 + 100)); // 100-400 ppm
    }
    return gases;
  }
}