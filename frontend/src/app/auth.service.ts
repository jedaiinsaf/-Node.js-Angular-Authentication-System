import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5500/api/auth';

  constructor(private http: HttpClient) {}

  signup(data: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }


  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // ✅ Ajouter cette méthode
  getProfile(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }
  changePassword(data: { oldPassword: string; newPassword: string; confirmPassword: string }): Observable<any> {
  const token = this.getToken();
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.post(`${this.apiUrl}/change-password`, data, { headers });
}
logout(): void {
  const token = this.getToken();

  if (token) {
    this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: () => {
        console.log('✅ Déconnexion côté serveur');
        this.clearSession();
      },
      error: (err) => {
        console.warn('⚠️ Erreur lors de la déconnexion côté serveur', err);
        this.clearSession(); // Même en cas d'erreur, on nettoie côté client
      }
    });
  } else {
    this.clearSession(); // Aucun token → on nettoie quand même
  }
}

private clearSession(): void {
  localStorage.removeItem('auth_token');
}

  
}
