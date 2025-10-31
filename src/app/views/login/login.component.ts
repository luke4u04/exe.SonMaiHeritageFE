import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if already logged in
    if (this.authService.isLoggedIn()) {
      this.redirectBasedOnRole();
      return;
    }

    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials: LoginRequest = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoading = false;
        
        // Redirect based on user role
        this.redirectBasedOnRole();
      },
      error: (error) => {
        console.error('Login error:', error);
        this.isLoading = false;
        
        if (error.status === 401) {
          this.errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng';
        } else if (error.status === 0) {
          this.errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
        } else {
          this.errorMessage = error.error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
        }
      }
    });
  }

  private redirectBasedOnRole(): void {
    const user = this.authService.getCurrentUser();
    
    if (user?.role === 'ADMIN') {
      // Redirect admin to admin panel
      this.router.navigate(['/admin']);
    } else {
      // Redirect regular users to home
      this.router.navigate(['/']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

}
