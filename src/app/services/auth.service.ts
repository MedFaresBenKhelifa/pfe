import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  register(firstName: string, lastName: string, email: string, password: string): Observable<any> {
    const csrfToken = this.getCookie('csrftoken');
    return this.http.post(`${this.apiUrl}/register/`, {
      first_name: firstName,
      last_name: lastName,
      email,
      password
    }, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrfToken || ''
      }
    }).pipe(
      tap((response: any) => {
        if (response.success && response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
      })
    );
  }

  login(email: string, password: string, rememberMe: boolean): Observable<any> {
    const csrfToken = this.getCookie('csrftoken');
    return this.http.post(`${this.apiUrl}/login/`, {
      email,
      password
    }, {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrfToken || ''
      }
    }).pipe(
      tap((response: any) => {
        if (response.success && response.token) {
          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem('token', response.token);
          storage.setItem('currentUser', JSON.stringify(response.user));
          storage.setItem('isLoggedIn', 'true');
        }
      })
    );
  }

  logout(): Observable<any> {
  const token = this.getToken();
  if (!token) {
    return throwError(() => new Error('Aucun token trouvé'));
  }

  const headers = new HttpHeaders({
    'Authorization': `Token ${token}`
  });

  return this.http.post(`${this.apiUrl}/logout/`, {}, {
    headers,
    withCredentials: true
  }).pipe(
    tap(() => {
      // Nettoyer uniquement les données d'authentification
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('isLoggedIn');
    })
  );
}

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
  clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('isLoggedIn');
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let c of ca) {
      c = c.trim();
      if (c.startsWith(nameEQ)) {
        return c.substring(nameEQ.length);
      }
    }
    return null;
  }
}
