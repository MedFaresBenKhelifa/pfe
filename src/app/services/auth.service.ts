import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  register(firstName: string, lastName: string, email: string, password: string): Observable<any> {
    const csrfToken = this.getCookie('csrftoken');
    return this.http.post(`${this.apiUrl}/register/`, 
      {
        first_name: firstName,
        last_name: lastName,
        email,
        password
      },
      {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken || ''
        }
      }
    ).pipe(
      tap((response: any) => {
        if (response.success) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
      })
    );
  }

  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }
}