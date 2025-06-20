import { Component } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  get showTempToast$() {
    return this.toastService.showTempToast$;
  }

  get showHighGasToast$() {
    return this.toastService.showHighGasToast$;
  }

  get showUnknownToast$() {
    return this.toastService.showUnknownToast$;
  }
}
