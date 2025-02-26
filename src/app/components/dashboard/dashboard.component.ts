import { Component, AfterViewInit, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnInit {
  temperatureChart: Chart | null = null;
  gasChart: Chart | null = null;

  ngOnInit() {}

  ngAfterViewInit() {
    this.renderTemperatureChart();
    this.renderCO2Chart();
  }

  renderTemperatureChart() {
    const currentHour = new Date().getHours();
    let labels = [];
    let startHour = Math.max(10, currentHour - 5);

    for (let i = 0; i < 6; i++) {
      let hour = (startHour + i) % 24;
      labels.push(hour < 12 ? `${hour}AM` : hour === 12 ? "12PM" : `${hour - 12}PM`);
    }

    let data = [22.5, 23.0, 23.5, 24.0, 24.2, 60];

    if (this.temperatureChart) {
      this.temperatureChart.destroy();
    }

    this.temperatureChart = new Chart('temperatureChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Temperature (°C)',
          data: data,
          borderColor: 'rgb(162, 5, 26)',
          backgroundColor: 'red',
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

    this.gasChart = new Chart('gasChart', {
      type: 'bar',
      data: {
        labels: ['CO₂ (ppm)', 'O₂ (%)'],
        datasets: [{
          label: 'Gas Levels ',
          data: [412, 20.9],
          backgroundColor: ['blue', 'green']
        }]
      },
      options: { responsive: true }
    });
  }
}
