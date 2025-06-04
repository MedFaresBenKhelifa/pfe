// src/app/services/mqtt.service.ts
import { Injectable } from '@angular/core';
import { connect, MqttClient } from 'mqtt';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MqttService {
  private client: MqttClient;
  private temperatureSubject = new BehaviorSubject<number>(0);
  private gasSubject = new BehaviorSubject<number>(0);

  temperature$ = this.temperatureSubject.asObservable();
  gas$ = this.gasSubject.asObservable();

  constructor() {
    this.client = connect('ws://192.168.1.169:9001'); // adresse du broker WebSocket Mosquitto

    this.client.on('connect', () => {
      console.log('MQTT connecté');
      this.client.subscribe('capteurs/temperature');
      this.client.subscribe('capteurs/gaz');
    });

    this.client.on('message', (topic, payload) => {
      const value = parseFloat(payload.toString());
      if (topic === 'capteurs/temperature') {
        this.temperatureSubject.next(value);
      } else if (topic === 'capteurs/gaz') {
        this.gasSubject.next(value);
      }
    });

    this.client.on('error', (err) => {
      console.error('MQTT Error:', err);
    });
  }
}
