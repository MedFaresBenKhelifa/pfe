import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verif',
  templateUrl: './verif.component.html',
  styleUrls: ['./verif.component.css']
})
export class VerifComponent {
  email: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  getVerif() {
    const emailInput = (document.getElementById('email') as HTMLInputElement).value.trim();

    if (!emailInput) {
      alert('Veuillez entrer un email.');
      return;
    }

    this.email = emailInput;

    this.http.post('http://localhost:8000/api/request-password-reset/', { email: this.email }, { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          alert('Code envoyé par email et va expiré dans 30 minutes....');
          localStorage.setItem('reset_email', this.email); // stocker email pour l'étape suivante
          this.router.navigate(['/Code']);
        },
        error: (error) => {
          console.error('Erreur complète :', error.error);
          alert('Erreur lors de l\'envoi du code');
        }
        
      });
  }
}
