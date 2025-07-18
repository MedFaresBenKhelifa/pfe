import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthToggleService } from '../../services/auth-toggle.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required),
    rememberMe: new FormControl(false)
  });

  isPasswordVisible = false;
  isLoading = false;
  errorMessage = '';
  isSignedUp = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authToggleService: AuthToggleService
  ) {}

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  showLogin() {
    this.authToggleService.setSignUpVisible(false);
    this.authToggleService.setLoginVisible(true);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password, rememberMe } = this.loginForm.value;

      this.http.post('http://localhost:8000/api/login/',
        { email, password },
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': this.getCookie('csrftoken') || ''
          }
        }
      ).subscribe({
        next: (response: any) => {
          console.log("Login response:", response);

          if (response.success && response.token) {
            if (rememberMe) {
              localStorage.setItem('token', response.token);
              localStorage.setItem('currentUser', JSON.stringify(response.user));
            } else {
              sessionStorage.setItem('token', response.token);
              sessionStorage.setItem('currentUser', JSON.stringify(response.user));
            }

            this.authToggleService.setLoggedIn(true);
            this.authToggleService.setSignUpVisible(false);
            this.authToggleService.setLoginVisible(false);
            this.authToggleService.setNavBar(true);
            this.router.navigate(['/Dashboard']);
          } else {
            this.errorMessage = response.error || "Erreur de connexion";
            this.authToggleService.setNavBar(false);
            this.authToggleService.setLoggedIn(false);
            this.authToggleService.setSignUpVisible(true);
            this.authToggleService.setLoginVisible(false);
          }

          this.isLoading = false;
        },
        error: (err) => {
          console.error("Login error:", err);
          this.errorMessage = err.error?.error || "Une erreur est survenue lors de la connexion";
          this.authToggleService.setNavBar(false);
          this.authToggleService.setLoggedIn(false);
          this.authToggleService.setSignUpVisible(true);
          this.authToggleService.setLoginVisible(false);
          this.isLoading = false;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');

    if (token && user) {
      this.authToggleService.setLoggedIn(true);
      this.authToggleService.setNavBar(true);
      this.authToggleService.setSignUpVisible(false);
      this.authToggleService.setLoginVisible(false);
      this.router.navigate(['/Dashboard']);
    } else {
      this.authToggleService.setLoggedIn(false);
      this.authToggleService.setNavBar(false);
      this.authToggleService.setSignUpVisible(true);
      this.authToggleService.setLoginVisible(false);
    }
  }

  private getCookie(name: string): string | null {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === name) return decodeURIComponent(value);
    }
    return null;
  }
}
