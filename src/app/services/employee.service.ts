// employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8000/api/employees/';

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addEmployee(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }

  updateEmployee(id: number, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}/`, formData);
  }
}