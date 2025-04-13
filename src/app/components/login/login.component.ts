import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthToggleService } from '../../services/auth-toggle.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isPasswordVisible: boolean = false;
  loginForm: FormGroup;

  constructor(
    private router: Router, 
    private authToggleService: AuthToggleService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  onSubmit(){}
  signUp() {
    this.authToggleService.setLoggedIn(false);
    this.authToggleService.setSignUpVisible(false);
    this.authToggleService.setLoginVisible(true); 
    this.authToggleService.setNavBar(false);
    this.router.navigate(['/SignUp']); 
  }

  join() {
    if (this.loginForm.valid) {
      this.authToggleService.setLoggedIn(true);
      this.authToggleService.setSignUpVisible(false);
      this.authToggleService.setLoginVisible(false); 
      this.authToggleService.setNavBar(true);
      this.router.navigate(['/Dashboard']); 
      
      // You can access form values like this:
      console.log('Email:', this.loginForm.value.email);
      console.log('Password:', this.loginForm.value.password);
      console.log('Remember Me:', this.loginForm.value.rememberMe);
    } else {
      // Mark all fields as touched to show validation errors
      this.loginForm.markAllAsTouched();
    }
  }

  // Helper methods for easy access in template
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}