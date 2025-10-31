import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/Dang-nhap']);
      return false;
    }

    // Check if user has admin role
    if (this.authService.isAdmin()) {
      return true;
    } else {
      // Redirect to home if not admin
      this.router.navigate(['/']);
      alert('Bạn không có quyền truy cập trang này!');
      return false;
    }
  }
}
