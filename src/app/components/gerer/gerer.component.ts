import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserEditModalComponent } from "../user-edit-modal/user-edit-modal.component";
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-gerer',
  standalone: true, 
  imports: [CommonModule, UserEditModalComponent, FormsModule],
  templateUrl: './gerer.component.html',
  styleUrls: ['./gerer.component.css'],
})
export class GererComponent {
  showModal = false;
  selectedUser: any = null;
  searchTerm: string = '';
  filteredUsers: any[] = [];

  users = [
    { nom: 'Mark', prenom: 'Otto', email: 'mark123@gmail.com' },
    { nom: 'Jacob', prenom: 'Thornton', email: 'fat@gmail.com' },
    { nom: 'Larry', prenom: 'The Bird', email: 'twitter@gmail.com' },
    { nom: 'John', prenom: 'Doe', email: 'john@gmail.com' },
    { nom: 'Jane', prenom: 'Smith', email: 'jane@gmail.com' },
    { nom: 'Jane', prenom: 'Smith', email: 'jane@gmail.com' },
  ];

  constructor(private cdr: ChangeDetectorRef) {
    this.filteredUsers = [...this.users];
  }

  applyFilter() {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user => 
      user.nom.toLowerCase().includes(term) ||
      user.prenom.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }

  openModal(user: any) {
    this.selectedUser = {...user};
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveChanges(updatedUser: any) {
    const index = this.users.findIndex(user => user.email === this.selectedUser.email);
    if (index !== -1) {
      this.users[index] = { ...updatedUser };
      this.applyFilter(); // Update filtered list after edit
    }
    this.closeModal();
  }

  deleteUser(index: number) {
    const user = this.filteredUsers[index];
    const confirmDelete = confirm(`Delete ${user.nom} ${user.prenom}?`);
    if (confirmDelete) {
      // Remove from main array
      const mainIndex = this.users.findIndex(u => u.email === user.email);
      if (mainIndex !== -1) {
        this.users.splice(mainIndex, 1);
      }
      // Remove from filtered array
      this.filteredUsers.splice(index, 1);
      this.cdr.markForCheck();
    }
  }
}