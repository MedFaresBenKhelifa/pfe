import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthToggleService } from '../../services/auth-toggle.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnDestroy {
  isSignedUp = true;
  isLoginVisible = false;
  isLoggedIn = false;
  navBar = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private authToggleService: AuthToggleService,
    private authService: AuthService,
    private router: Router
  ) {
    this.subscriptions.push(
      this.authToggleService.isSignedUp$.subscribe((state) => this.isSignedUp = state),
      this.authToggleService.navBar$.subscribe((state) => this.navBar = state),
      this.authToggleService.isLoginVisible$.subscribe((state) => this.isLoginVisible = state),
      this.authToggleService.isLoggedIn$.subscribe((state) => this.isLoggedIn = state)
    );
  }

  logout() {
    const token = this.authService.getToken();
    if (!token) {
      console.warn('Impossible de se déconnecter : token manquant.');
      return;
    }

    console.log('Début de la déconnexion...');
    this.authService.logout().subscribe({
      next: () => {
        console.log('Déconnexion réussie');
        localStorage.clear();
        this.authToggleService.setLoggedIn(false);
        this.authToggleService.setSignUpVisible(true);
        this.authToggleService.setLoginVisible(false);
        this.authToggleService.setNavBar(false);
        this.router.navigate(['/LogIn']);
      },
      error: (err) => {
        console.error('Erreur lors de la déconnexion', err);
      }
    });
  }

  showLogin() {
    this.authToggleService.setSignUpVisible(false);
    this.authToggleService.setLoginVisible(true);
    this.authToggleService.setNavBar(false);
  }

  showSignup() {
    this.authToggleService.setSignUpVisible(false);
    this.authToggleService.setLoginVisible(true);
    this.authToggleService.setNavBar(false);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
