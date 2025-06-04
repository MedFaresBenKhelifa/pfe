import { Component, OnInit, OnDestroy, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { ToastService } from '../../services/toast.service';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
})
export class DashboardComponent implements OnInit, OnDestroy {
  temperatureChart: any;
  gasChart: any;

  accessLogs: any[] = [];
  filteredLogs: any[] = [];
  selectedDate: string = '';

  currentTemperatures: number[] = [];
  currentGasReadings: number[] = [];
  currentTimestamps: string[] = [];
  mqttClient: any;

  pollingSubscription!: Subscription;
  private isBrowser: boolean;

  constructor(
    private toastService: ToastService,
    private http: HttpClient,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.loadSensorData();
    }
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.createCharts();
      this.connectToMqtt();
    }
    this.fetchAccessLogs();

    this.pollingSubscription = interval(2000).subscribe(() => {
      this.fetchNewAccessLogs();
    });
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }

    if (this.isBrowser) {
      if (this.mqttClient) {
        this.mqttClient.end();
      }
      if (this.temperatureChart) {
        this.temperatureChart.destroy();
      }
      if (this.gasChart) {
        this.gasChart.destroy();
      }
    }
  }

  loadSensorData(): void {
    if (this.isBrowser) {
      this.currentTemperatures = JSON.parse(localStorage.getItem('temperatures') || '[]');
      this.currentGasReadings = JSON.parse(localStorage.getItem('gasReadings') || '[]');
      this.currentTimestamps = JSON.parse(localStorage.getItem('timestamps') || '[]');

      const fill = (arr: any[], length: number, val: any) => {
        while (arr.length < length) arr.unshift(val);
        return arr.slice(-6);
      };

      this.currentTemperatures = fill(this.currentTemperatures, 6, 0);
      this.currentGasReadings = fill(this.currentGasReadings, 6, 0);
      this.currentTimestamps = fill(this.currentTimestamps, 6, '');
    }
  }

  saveSensorData(): void {
    if (this.isBrowser) {
      localStorage.setItem('temperatures', JSON.stringify(this.currentTemperatures));
      localStorage.setItem('gasReadings', JSON.stringify(this.currentGasReadings));
      localStorage.setItem('timestamps', JSON.stringify(this.currentTimestamps));
    }
  }

  fetchAccessLogs(): void {
    this.http.get<any[]>('https://192.168.1.169:4000/api/logs').subscribe({
      next: (logs) => {
        this.accessLogs = logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        this.filterLogsByDate();
      },
      error: (err) => {
        console.error('❌ Failed to fetch access logs:', err);
      }
    });
  }

  fetchNewAccessLogs(): void {
    this.http.get<any[]>('https://192.168.1.169:4000/api/logs').subscribe({
      next: (logs) => {
        const latestLogs = logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        if (
          this.accessLogs.length === 0 ||
          latestLogs[0].timestamp !== this.accessLogs[0].timestamp
        ) {
          this.accessLogs = latestLogs;
          this.filterLogsByDate();

          const newest = latestLogs[0];
          console.log('📥 Newest access log:', newest);

          const name = (newest.employeeName || '').toLowerCase().trim();

          if (!name || name === 'inconnu') {
            this.toastService.triggerUnknownToast();
          } 
          
        }
      },
      error: (err) => {
        console.error('❌ Polling failed:', err);
      }
    });
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
    this.filterLogsByDate();
  }

  filterLogsByDate(): void {
    if (!this.selectedDate) {
      this.filteredLogs = this.accessLogs;
      return;
    }

    const selected = new Date(this.selectedDate);
    this.filteredLogs = this.accessLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      return (
        logDate.getFullYear() === selected.getFullYear() &&
        logDate.getMonth() === selected.getMonth() &&
        logDate.getDate() === selected.getDate()
      );
    });
  }

  async connectToMqtt(): Promise<void> {
  if (!this.isBrowser) return;

  const mqtt = await import('mqtt');
  this.mqttClient = mqtt.default.connect('wss://192.168.1.169:9001');

  this.mqttClient.on('connect', () => {
    console.log('✅ MQTT connecté');
    this.mqttClient.subscribe('environnement/data');
  });

  this.mqttClient.on('message', (topic: string, message: Uint8Array) => {
    this.ngZone.run(() => {
      try {
        const payload = JSON.parse(message.toString());
        const now = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        if ('temperature' in payload) {
          const temp = parseFloat(payload.temperature);
          if (!isNaN(temp)) {
            this.currentTemperatures.shift();
            this.currentTemperatures.push(temp);
            this.currentTimestamps.shift();
            this.currentTimestamps.push(now);
            this.updateTemperatureChart();
            this.saveSensorData();
            if (temp > 30) this.toastService.triggerTempToast();
          }
        }

        if ('gaz' in payload) {
          const gas = Number(payload.gaz);
          if (!isNaN(gas)) {
            this.currentGasReadings.shift();
            this.currentGasReadings.push(gas);
            this.updateGasChart();
            this.saveSensorData();
            if (gas > 0) this.toastService.triggerHighGasToast();
          }
        }
      } catch (err) {
        console.error('❌ Erreur de parsing MQTT:', err);
      }
    });
  });

  this.mqttClient.on('error', (err: any) => {
    console.error('❌ MQTT error:', err);
  });
}


  getAccessType(type: string): string {
    switch (type) {
      case 'entry': return 'Entrée';
      case 'exit': return 'Sortie';
      default: return 'Tentative';
    }
  }

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

 downloadPhoto(originalUrl: string): void {
  if (!originalUrl) return;

  // Use relative path for proxied requests
  const proxyPath = '/media'; // Must match your proxy configuration
  const url = originalUrl.startsWith('http://') 
    ? originalUrl.replace(/^http:\/\/[^/]+/, proxyPath)
    : originalUrl;

  const fileName = url.split('/').pop() || 'photo.jpg';

  this.http.get(url, { responseType: 'blob' }).subscribe({
    next: (blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = decodeURIComponent(fileName);
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    },
    error: (err) => {
      console.error('Download failed:', err);
      // Fallback: Open in new tab if download fails
      window.open(originalUrl, '_blank');
    }
  });
}

  private createCharts(): void {
    if (!this.isBrowser) return;

    const tempCtx = document.getElementById('temperatureChart') as HTMLCanvasElement;
    const gasCtx = document.getElementById('gasChart') as HTMLCanvasElement;

    if (this.temperatureChart) this.temperatureChart.destroy();
    if (this.gasChart) this.gasChart.destroy();

    this.temperatureChart = new Chart(tempCtx, {
      type: 'line',
      data: {
        labels: this.currentTimestamps,
        datasets: [{
          label: 'Température (°C)',
          data: this.currentTemperatures,
          borderColor: 'rgba(255,99,132,1)',
          backgroundColor: 'rgba(255,99,132,0.2)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        animation: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (val: any) => val + '°C'
            }
          }
        }
      }
    });

    this.gasChart = new Chart(gasCtx, {
      type: 'line',
      data: {
        labels: this.currentTimestamps,
        datasets: [{
          label: 'Détection de gaz',
          data: this.currentGasReadings,
          borderColor: 'rgba(54,162,235,1)',
          backgroundColor: 'rgba(54,162,235,0.2)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        animation: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 1,
            ticks: {
              callback: (val: any) => val == 1 ? 'Gaz détecté' : 'OK'
            }
          }
        }
      }
    });
  }

  private updateTemperatureChart(): void {
    if (this.temperatureChart && this.isBrowser) {
      this.temperatureChart.data.labels = this.currentTimestamps;
      this.temperatureChart.data.datasets[0].data = this.currentTemperatures;
      this.temperatureChart.update();
    }
  }

  private updateGasChart(): void {
    if (this.gasChart && this.isBrowser) {
      this.gasChart.data.labels = this.currentTimestamps;
      this.gasChart.data.datasets[0].data = this.currentGasReadings;
      this.gasChart.update();
    }
  }

  filterLogsByName(term: string): void {
    const lowerTerm = term.toLowerCase().trim();
    this.filteredLogs = this.accessLogs.filter(log =>
      log.employeeName.toLowerCase().includes(lowerTerm)
    );
  }
}
