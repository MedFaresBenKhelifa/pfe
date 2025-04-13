import { Component } from '@angular/core';

@Component({
  selector: 'app-ajout',
  imports: [],
  standalone: true,
  templateUrl: './ajout.component.html',
  styleUrl: './ajout.component.css'
})
export class AjoutComponent {
  imagePreview: string | ArrayBuffer | null = null;
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
