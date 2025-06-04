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
    private router: Router
  ) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  addEmployee(firstNameInput: HTMLInputElement, lastNameInput: HTMLInputElement, emailInput: HTMLInputElement): void {
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();

    if (!firstName && !lastName && !email && !this.selectedFile) {
      alert('Tous les champs sont obligatoires.');
      return;
    }

    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);

    if (this.selectedFile) {
      const extension = this.selectedFile.name.split('.').pop();
      const newFileName = `${lastName}_${firstName}.${extension}`.toLowerCase().replace(/\s+/g, '_');
      const renamedFile = new File([this.selectedFile], newFileName, { type: this.selectedFile.type });
      formData.append('profile_image', renamedFile);
    }

    // Debug des données envoyées
    formData.forEach((value, key) => console.log(`${key}:`, value));

    this.employeeService.addEmployee(formData).subscribe({
      next: (response) => {
        alert('Employé ajouté avec succès !');
        firstNameInput.value = '';
        lastNameInput.value = '';
        emailInput.value = '';
        this.imagePreview = null;
        this.selectedFile = null;
        this.router.navigate(['/Gerer']);
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout de l\'employé :', error);
        if (error.status === 400) {
          alert(' Email Existant');
        } else if (error.status === 401) {
          alert('Erreur 401 - Non autorisé. Le token est peut-être invalide.');
        } else {
          alert('Erreur inconnue. Veuillez réessayer.');
        }
      }
    });
  }
}
