import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-edit-modal',
  standalone: true, // Mark as standalone
  imports: [FormsModule], // Add FormsModule here
  templateUrl: './user-edit-modal.component.html',
  styleUrl: './user-edit-modal.component.css'
})
export class UserEditModalComponent {
  @Input() userData: any;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  isVisible = false;

  @Input() 
  set visible(value: boolean) {
    this.isVisible = value;
  }


  saveChanges() {
    this.save.emit(this.userData);
  }

  closeModal() {
    this.close.emit();
  }
}