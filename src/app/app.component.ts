import { Component } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ToastComponent } from './components/toast/toast.component';
import { ToastService } from './services/toast.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent,ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dash';
  constructor(private toastService: ToastService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        const hideRoutes = ['/LogIn', '/SignUp','/Code','/Verif','/Change'];
        this.toastService.setEnabled(!hideRoutes.includes(event.url));
      }
    });
  }
}