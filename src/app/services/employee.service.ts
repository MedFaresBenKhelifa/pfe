import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8000/api/employees/';

  constructor(private http: HttpClient) {}

  // Méthode pour obtenir les en-têtes avec le token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Token ${token}`
    });
  }

  // Obtenir tous les employés
  getEmployees(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  // Ajouter un nouvel employé
  addEmployee(formData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.apiUrl, formData, { headers });
  }

  // Supprimer un employé par ID
  deleteEmployee(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}${id}/`, { headers });
  }

  // Mettre à jour un employé existant par ID
  updateEmployee(id: number, formData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}${id}/`, formData, { headers });
  }
}
