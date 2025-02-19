import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthToggleService } from '../../services/auth-toggle.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isPasswordVisible: boolean = false;

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  constructor(private router: Router, private authToggleService: AuthToggleService) {}

  join() {
    this.authToggleService.setLoggedIn(true); // Show Log Out
    this.authToggleService.setSignUpVisible(false); // Hide Sign Up
    this.authToggleService.setLoginVisible(false); // Hide Log In
    this.router.navigate(['/Dashboard']); // Redirect
  }
}
