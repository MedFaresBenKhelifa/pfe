import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';
import mqtt, { MqttClient } from 'mqtt';

@Injectable({ providedIn: 'root' })
export class MonitoringService {
  private mqttClient!: MqttClient;

  public currentTemperatures: number[] = [];
  public currentGasLevels: number[] = [];
  public timestamps: string[] = []; // ← ajout des timestamps

  constructor(private toastService: ToastService) {
    this.initializeArrays();
    this.connectToMQTTBroker();
  }

  private initializeArrays(): void {
    this.currentTemperatures = Array(6).fill(0);
    this.currentGasLevels = Array(6).fill(0);
    this.timestamps = Array(6).fill(''); // ← initialise les labels
  }

  private connectToMQTTBroker(): void {
    this.mqttClient = mqtt.connect('ws://192.168.1.169:9001');

    this.mqttClient.on('connect', () => {
      console.log('✅ Connecté au broker MQTT via WebSocket');
      this.mqttClient.subscribe('capteurs/temperature');
      this.mqttClient.subscribe('capteurs/gaz');
    });

    this.mqttClient.on('message', (topic: string, payload: Buffer) => {
      const message = payload.toString();

      if (topic === 'capteurs/temperature') {
        const temp = parseFloat(message);
        if (!isNaN(temp)) {
          this.updateTemperature(temp);
        }
      }

      if (topic === 'capteurs/gaz') {
        const gas = parseInt(message, 10);
        if (!isNaN(gas)) {
          this.updateGasLevel(gas);
        }
      }
    });
  }

  private updateTemperature(value: number): void {
    this.currentTemperatures.shift();
    this.currentTemperatures.push(value);

    // Mettre à jour le timestamp à chaque nouvelle température
    this.timestamps.shift();
    this.timestamps.push(
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );

    if (value > 30) {
      this.toastService.triggerTempToast();
    }
  }

  private updateGasLevel(value: number): void {
    this.currentGasLevels.shift();
    this.currentGasLevels.push(value);

    if (value > 300) {
      this.toastService.triggerHighGasToast();
    }
  }

  public resetData(): void {
    this.initializeArrays();
  }
}
