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
  signUp() {
    this.authToggleService.setLoggedIn(false);
    this.authToggleService.setSignUpVisible(false);
    this.authToggleService.setLoginVisible(true); 
    this.authToggleService.setNavBar(false);
    this.router.navigate(['/SignUp']); 
  }
  join() {
    this.authToggleService.setLoggedIn(true);
    this.authToggleService.setSignUpVisible(false);
    this.authToggleService.setLoginVisible(false); 
    this.authToggleService.setNavBar(true);
    this.router.navigate(['/Dashboard']); 
  }

}
