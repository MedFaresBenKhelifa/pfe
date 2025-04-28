import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // Add this
import { UserEditModalComponent } from '../user-edit-modal/user-edit-modal.component'; // Add this

@Component({
  selector: 'app-gerer',
  standalone: true,
  imports: [CommonModule, UserEditModalComponent], // Add these imports
  templateUrl: './gerer.component.html',
  styleUrls: ['./gerer.component.css']
})
export class GererComponent implements OnInit {
  showModal = false;
  selectedUser: any = null;
  filteredUsers: any[] = [];
  users: any[] = [];
  searchInput: HTMLInputElement | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.users = employees;
        this.filteredUsers = [...this.users];
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      }
    });
  }

  applyFilter(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }

    const term = searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user => 
      user.last_name.toLowerCase().includes(term) ||
      user.first_name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }

  openModal(user: any): void {
    this.selectedUser = {...user};
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveChanges(updatedUser: any): void {
    const formData = new FormData();
    formData.append('first_name', updatedUser.first_name);
    formData.append('last_name', updatedUser.last_name);
    formData.append('email', updatedUser.email);

    this.employeeService.updateEmployee(updatedUser.id, formData).subscribe({
      next: (response) => {
        this.loadEmployees();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error updating employee:', error);
      }
    });
  }

  deleteUser(index: number): void {
    const user = this.filteredUsers[index];
    const confirmDelete = confirm(`Delete ${user.first_name} ${user.last_name}?`);
    if (confirmDelete) {
      this.employeeService.deleteEmployee(user.id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
        }
      });
    }
  }
}