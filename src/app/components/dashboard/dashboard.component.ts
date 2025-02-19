import { Component, AfterViewInit, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

interface AccessLog {
  name: string;
  time: string;
  type: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnInit {
  isDarkTheme = false;
  temperatureChart: Chart | null = null;

  ngOnInit() {
  const savedTheme = localStorage.getItem("theme") || "light";
  this.isDarkTheme = savedTheme === "dark";

  if (this.isDarkTheme) {
    document.documentElement.setAttribute("data-theme", "dark");
    document.body.classList.add("dark-mode");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    document.body.classList.remove("dark-mode");
  }

  document.getElementById("theme-icon")!.textContent = this.isDarkTheme ? "🌙" : "🌞";
}


  ngAfterViewInit() {
    this.renderTemperatureChart();
    this.renderCO2Chart();
  }

 toggleTheme() {
  this.isDarkTheme = !this.isDarkTheme;

  if (this.isDarkTheme) {
    document.documentElement.setAttribute("data-theme", "dark");
    document.body.classList.add("dark-mode"); // Apply dark mode class
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    document.body.classList.remove("dark-mode"); // Remove dark mode class
    localStorage.setItem("theme", "light");
  }

  document.getElementById("theme-icon")!.textContent = this.isDarkTheme ? "🌙" : "🌞";
}



  renderTemperatureChart() {
    // Generate hourly labels dynamically based on current time
    const currentHour = new Date().getHours();
    let labels = [];
    let startHour = Math.max(10, currentHour - 5); // Start at 10 AM or 5 hours before now

    for (let i = 0; i < 6; i++) {
      let hour = (startHour + i) % 24;
      let label = hour < 12 ? `${hour}AM` : (hour === 12 ? `12PM` : `${hour - 12}PM`);
      labels.push(label);
    }

    let data = [22.5, 23.0, 23.5, 24.0, 24.2, 24.5]; // Example values, replace with actual data

    if (this.temperatureChart) {
      this.temperatureChart.destroy(); // Destroy previous chart before rendering new
    }

    this.temperatureChart = new Chart('temperatureChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Temperature (°C)',
          data: data,
          borderColor: 'blue',
          backgroundColor: 'rgba(0, 0, 255, 0.2)',
          fill: true
        }]
      },
      options: { responsive: true }
    });
  }

  renderCO2Chart() {
    new Chart('gasChart', {
      type: 'bar',
      data: {
        labels: ['CO₂ (ppm)', 'O₂ (%)'],
        datasets: [{
          label: 'Gas Levels',
          data: [412, 20.9],
          backgroundColor: ['blue', 'green']
        }]
      },
      options: { responsive: true }
    });
  }
}
