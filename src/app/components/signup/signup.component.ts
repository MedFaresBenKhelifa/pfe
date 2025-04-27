import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthToggleService } from '../../services/auth-toggle.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    acceptTerms: new FormControl(false, Validators.requiredTrue)
  });

  isPasswordVisible = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private authToggleService: AuthToggleService ,
  ) {}

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { firstName, lastName, email, password } = this.signupForm.value;

    this.authService.register(firstName!, lastName!, email!, password!)
      .subscribe({
        next: (response: any) => {
          this.successMessage = 'Compte créé avec succès';
          setTimeout(() => {
            this.authToggleService.setLoggedIn(true);
            this.authToggleService.setSignUpVisible(false);
            this.authToggleService.setLoginVisible(false); 
            this.authToggleService.setNavBar(true);
            this.router.navigate(['/Dashboard/']);
          }, 2000);
        },
        error: (error: any) => {
          this.errorMessage = error.error?.error || 'Erreur lors de l\'inscription';
          this.isLoading = false;
        }
      });
  }
}