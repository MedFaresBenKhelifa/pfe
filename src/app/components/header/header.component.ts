import { Component } from '@angular/core';
import { RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthToggleService } from '../../services/auth-toggle.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isSignedUp = true;
  isLoginVisible = false;
  isLoggedIn = false;
  navBar = false;

  constructor(private authToggleService: AuthToggleService) {
    this.authToggleService.isSignedUp$.subscribe((state) => {
      this.isSignedUp = state;
    });
    this.authToggleService.navBar$.subscribe((state) => {
      this.navBar = state;
    });

    this.authToggleService.isLoginVisible$.subscribe((state) => {
      this.isLoginVisible = state;
    });

    this.authToggleService.isLoggedIn$.subscribe((state) => {
      this.isLoggedIn = state;
    });
  }

  logout() {
    this.authToggleService.setLoggedIn(false);
    this.authToggleService.setSignUpVisible(true);
    this.authToggleService.setLoginVisible(false);
    this.authToggleService.setNavBar(false);
  }

  showLogin() {
    this.authToggleService.setSignUpVisible(false);
    this.authToggleService.setLoginVisible(true);
    this.authToggleService.setNavBar(false);
  }
  showSignup(){
    this.authToggleService.setSignUpVisible(true);
    this.authToggleService.setLoginVisible(false);
    this.authToggleService.setNavBar(false);
  }
  onLogoClick(){
    this.authToggleService.setSignUpVisible(true);
    this.authToggleService.setLoginVisible(false);
    this.authToggleService.setLoggedIn(false);
    this.authToggleService.setNavBar(false);
  }
}
