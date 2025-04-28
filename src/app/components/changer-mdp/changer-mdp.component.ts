import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-changer-mdp',
  templateUrl: './changer-mdp.component.html',
  styleUrls: ['./changer-mdp.component.css']
})
export class ChangerMdpComponent {
  constructor(private router: Router, private http: HttpClient) {}

  backToLogin() {
    const newPassword = (document.getElementById('new-password') as HTMLInputElement).value.trim();
    const confirmPassword = (document.getElementById('confirm-password') as HTMLInputElement).value.trim();
    const email = localStorage.getItem('reset_email');
    const code = localStorage.getItem('reset_code');

    if (!newPassword || !confirmPassword) {
      alert('Veuillez remplir les deux champs.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!email || !code) {
      alert('Erreur: email ou code introuvable.');
      return;
    }

    this.http.post('http://localhost:8000/api/reset-password/', 
      { email: email, code: code, new_password: newPassword }, 
      { withCredentials: true }
    ).subscribe({
      next: (response: any) => {
        alert('Mot de passe modifié avec succès.');
        localStorage.removeItem('reset_email');
        localStorage.removeItem('reset_code');
        this.router.navigate(['/LogIn']);
      },
      error: (error) => {
        alert('Erreur lors de la mise à jour du mot de passe.');
        console.error(error);
      }
    });
  }
}
