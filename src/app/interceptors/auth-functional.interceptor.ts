import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Functional Auth Interceptor called for:', req.url);
  
  const authService = inject(AuthService);
  const authToken = authService.getToken();
  
  console.log('Auth token in functional interceptor:', authToken ? 'Token exists' : 'No token');
  
  if (authToken) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    console.log('Request with auth header:', authReq.headers.get('Authorization'));
    return next(authReq);
  }
  
  console.log('No token, proceeding without auth header');
  return next(req);
};









