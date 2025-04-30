// ajout.component.ts
import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajout',
  templateUrl: './ajout.component.html',
  styleUrls: ['./ajout.component.css']
})
export class AjoutComponent {
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    
  ) {}


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addEmployee(firstNameInput: HTMLInputElement, lastNameInput: HTMLInputElement, emailInput: HTMLInputElement): void {
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const email = emailInput.value;

    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    if (this.selectedFile) {
      formData.append('profile_image', this.selectedFile);
    }

    this.employeeService.addEmployee(formData).subscribe({
      next: (response) => {
        alert('Employee added successfully!');
        // Reset form
        firstNameInput.value = '';
        lastNameInput.value = '';
        emailInput.value = '';
        this.imagePreview = null;
        this.selectedFile = null;
        this.router.navigate(['/Gerer']);
      },
      error: (error) => {
        console.error('Error adding employee:', error);
        alert('Error adding employee. Please try again.');
      }
    });
  }
}