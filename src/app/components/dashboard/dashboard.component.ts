import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnInit, OnDestroy {
  temperatureChart: Chart | null = null;
  gasChart: Chart | null = null;
  private intervalId: any;

  ngOnInit() {}

  ngAfterViewInit() {
    this.renderTemperatureChart();
    this.renderCO2Chart();
    // 🔥 Démarrer l'interval pour update les données toutes les 10s
    this.intervalId = setInterval(() => {
      this.updateChartsRandomly();
    }, 10000); // 10 000 ms = 10 sec
  }

  ngOnDestroy() {
    // Nettoyer l'interval quand le composant est détruit
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  renderTemperatureChart() {
    const currentHour = new Date().getHours();
    let labels = [];
    let startHour = Math.max(10, currentHour - 5);

    for (let i = 0; i < 6; i++) {
      let hour = (startHour + i) % 24;
      labels.push(hour < 12 ? `${hour}AM` : hour === 12 ? "12PM" : `${hour - 12}PM`);
    }

    if (this.temperatureChart) {
      this.temperatureChart.destroy();
    }

    this.temperatureChart = new Chart('temperatureChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Temperature (°C)',
          data: this.generateRandomTemperatures(),
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
          label: 'Gas Levels',
          data: this.generateRandomGasLevels(),
          backgroundColor: ['blue', 'green']
        }]
      },
      options: { responsive: true }
    });
  }

  // 🔥 Mettre à jour les données aléatoires
  updateChartsRandomly() {
    if (this.temperatureChart && this.temperatureChart.data.datasets[0]) {
      this.temperatureChart.data.datasets[0].data = this.generateRandomTemperatures();
      this.temperatureChart.update();
    }

    if (this.gasChart && this.gasChart.data.datasets[0]) {
      this.gasChart.data.datasets[0].data = this.generateRandomGasLevels();
      this.gasChart.update();
    }
  }

  // 🔥 Générer des températures aléatoires
  generateRandomTemperatures(): number[] {
    const temps: number[] = [];
    for (let i = 0; i < 6; i++) {
      temps.push(Number((Math.random() * 10 + 20).toFixed(1))); // entre 20°C et 30°C
    }
    return temps;
  }

  // 🔥 Générer des niveaux de gaz aléatoires
  generateRandomGasLevels(): number[] {
    const co2 = Math.floor(Math.random() * 200 + 300); // entre 300 et 500 ppm
    const o2 = Number((Math.random() * 5 + 19).toFixed(1)); // entre 19% et 24%
    return [co2, o2];
  }
}
