import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent {
  constructor(private router: Router, private http: HttpClient) {}

  verifCode() {
    const codeInput = (document.getElementById('verification-code') as HTMLInputElement).value.trim();
    const email = localStorage.getItem('reset_email');

    if (!email || !codeInput) {
      alert('Veuillez entrer votre email et le code.');
      return;
    }

    this.http.post('http://localhost:8000/api/verify-reset-code/', { email: email, code: codeInput }, { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          alert('Code vérifié.');
          localStorage.setItem('reset_code', codeInput); // stocker le code aussi pour l'étape suivante
          this.router.navigate(['/Change']);
        },
        error: (error) => {
          alert('Code incorrect ou expiré.');
          console.error(error);
        }
      });
  }
}
