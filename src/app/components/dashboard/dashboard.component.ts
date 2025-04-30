import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import Chart from 'chart.js/auto';
import { MonitoringService } from '../../services/monitoring.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  @ViewChild('temperatureCanvas') temperatureCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('gasCanvas') gasCanvas!: ElementRef<HTMLCanvasElement>;
  
  temperatureChart: Chart | null = null;
  gasChart: Chart | null = null;
  private chartUpdateInterval: any;

  constructor(
    public monitoringService: MonitoringService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeCharts();
      this.startChartUpdates();
    }
  }

  private initializeCharts(): void {
    this.renderTemperatureChart();
    this.renderGasChart();
  }

  private startChartUpdates(): void {
    this.chartUpdateInterval = setInterval(() => {
      this.updateChartsWithSlide();
    }, 5000);
  }

private updateChartsWithSlide(): void {
  // Access data directly from the service
  if (this.temperatureChart) {
    this.temperatureChart.data.datasets[0].data = this.monitoringService.currentTemperatures;
    this.temperatureChart.update();
  }

  if (this.gasChart) {
    this.gasChart.data.datasets[0].data = this.monitoringService.currentGasLevels;
    this.gasChart.update();
  }
}

private renderTemperatureChart(): void {
  const ctx = this.temperatureCanvas?.nativeElement.getContext('2d');
  if (!ctx) return;

  this.temperatureChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: this.generateHourLabels(),
      datasets: [{
        label: 'Température (°C)',
        data: this.monitoringService.currentTemperatures, // Use public property
        borderColor: 'rgb(162, 5, 26)',
        backgroundColor: 'rgba(162, 5, 26, 0.3)',
        fill: true
      }]
    },
    options: { responsive: true }
  });
}

private renderGasChart(): void {
  const ctx = this.gasCanvas?.nativeElement.getContext('2d');
  if (!ctx) return;

  this.gasChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: this.generateHourLabels(),
      datasets: [{
        label: 'Niveaux de Gaz (CO₂ ppm)',
        data: this.monitoringService.currentGasLevels, // Use public property
        backgroundColor: 'blue'
      }]
    },
    options: { responsive: true }
  });
}

  private generateHourLabels(): string[] {
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

  ngOnDestroy(): void {
    if (this.chartUpdateInterval) {
      clearInterval(this.chartUpdateInterval);
    }
    if (this.temperatureChart) {
      this.temperatureChart.destroy();
    }
    if (this.gasChart) {
      this.gasChart.destroy();
    }
  }
}