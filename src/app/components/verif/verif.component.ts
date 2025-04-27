import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verif',
  imports: [],
  templateUrl: './verif.component.html',
  styleUrl: './verif.component.css'
})
export class VerifComponent {
constructor(private router: Router) {}
  getVerif() {
    this.router.navigate(['/Code']); 
  }
}