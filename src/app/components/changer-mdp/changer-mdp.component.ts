import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changer-mdp',
  imports: [],
  templateUrl: './changer-mdp.component.html',
  styleUrl: './changer-mdp.component.css'
})
export class ChangerMdpComponent {
  constructor(private router: Router) {}
    backToLogin() {
      this.router.navigate(['/login']); 
    }
}
