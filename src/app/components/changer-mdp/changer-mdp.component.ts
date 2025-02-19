import { Component } from '@angular/core';

@Component({
  selector: 'app-changer-mdp',
  imports: [],
  templateUrl: './changer-mdp.component.html',
  styleUrl: './changer-mdp.component.css'
})
export class ChangerMdpComponent {
  isPasswordVisible: boolean = false;

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

}
