import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserEditModalComponent } from "../user-edit-modal/user-edit-modal.component";

@Component({
  selector: 'app-gerer',
  standalone: true, 
  imports: [CommonModule, UserEditModalComponent],
  templateUrl: './gerer.component.html',
  styleUrl: './gerer.component.css'
})
export class GererComponent {
  showModal = false;
  selectedUser: any = null;

  users = [
    { nom: 'Mark', prenom: 'Otto', email: 'mark123@gmail.com' },
    { nom: 'Jacob', prenom: 'Thornton', email: 'fat' },
    { nom: 'Larry', prenom: 'The Bird', email: 'twitter' },
    { nom: 'Larry', prenom: 'The Bird', email: 'twitter' },
    { nom: 'Larry', prenom: 'The Bird', email: 'twitter' },
  ];

  openModal(user: any) {
    this.selectedUser = null;
    this.showModal = false;
  
    // Ensure the modal has time to unmount (optional delay)
    setTimeout(() => {
      this.selectedUser = user;
      this.showModal = true;
    }, 0);
  }

  closeModal() {
    this.showModal = false;
  }
  saveChanges(updatedUser: any) {
    const index = this.users.findIndex(user => user === this.selectedUser);
    if (index !== -1) {
      this.users[index] = { ...updatedUser }; // update user
    }
    this.closeModal(); // close modal
  }
  
}
