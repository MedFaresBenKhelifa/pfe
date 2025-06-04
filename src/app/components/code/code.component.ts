import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent implements OnInit, OnDestroy {
  minutes: number = 30;
  seconds: number = 0;
  isExpired: boolean = false;
  private countdownInterval: any;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    clearInterval(this.countdownInterval);
  }

  startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      if (this.seconds === 0) {
        if (this.minutes === 0) {
          clearInterval(this.countdownInterval);
          this.isExpired = true;
          alert('Le code a expiré.');
        } else {
          this.minutes--;
          this.seconds = 59;
        }
      } else {
        this.seconds--;
      }
    }, 1000);
  }

  verifCode() {
    if (this.isExpired) {
      alert('Le code est expiré. Veuillez redemander un nouveau code.');
      return;
    }

    const codeInput = (document.getElementById('verification-code') as HTMLInputElement).value.trim();
    const email = localStorage.getItem('reset_email');

    if (!codeInput) {
      alert('Veuillez entrer le code.');
      return;
    }

    this.http.post('http://localhost:8000/api/verify-reset-code/', {
      email: email,
      code: codeInput
    }, { withCredentials: true }).subscribe({
      next: (response: any) => {
        alert('Code vérifié.');
        localStorage.setItem('reset_code', codeInput);
        this.router.navigate(['/Change']);
      },
      error: (error) => {
        alert('Code incorrect ou expiré.');
        console.error(error);
      }
    });
  }
}
