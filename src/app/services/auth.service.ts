import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
    enabled: boolean;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  enabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check if user is already logged in
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          // Store token and user info
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          
          // Update current user subject
          this.currentUserSubject.next(response.user);
        })
      );
  }

  logout(): void {
    // Clear storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear current user
    this.currentUserSubject.next(null);
    
    // Redirect to home
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN' || false;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Register method (if needed)
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }
}
