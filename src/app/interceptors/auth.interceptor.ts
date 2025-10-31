import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  private authService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Auth Interceptor called for:', req.url);
    
    // Get the auth token from the service
    const authToken = this.authService.getToken();
    console.log('Auth token in interceptor:', authToken ? 'Token exists' : 'No token');
    
    // Clone the request and add the authorization header if token exists
    if (authToken) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`)
      });
      console.log('Request with auth header:', authReq.headers.get('Authorization'));
      return next.handle(authReq);
    }
    
    console.log('No token, proceeding without auth header');
    // If no token, proceed with original request
    return next.handle(req);
  }
}

