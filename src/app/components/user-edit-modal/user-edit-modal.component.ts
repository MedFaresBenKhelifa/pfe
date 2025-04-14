import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-edit-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-edit-modal.component.html',
  styleUrls: ['./user-edit-modal.component.css']
})
export class UserEditModalComponent {
  private _userData: any = null;
  
  @Input() 
  set userData(value: any) {
    this._userData = value ? {...value} : null;
  }
  get userData(): any {
    return this._userData;
  }

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  @Input() isVisible = false;

  saveChanges() {
    if (this.userData) {
      this.save.emit({...this.userData});
    }
  }

  closeModal() {
    this.close.emit();
  }
}