import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { RouterConstant } from '../../constants/routerConstants';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
    cartService = inject(CartService);
    authService = inject(AuthService);
    router = inject(Router);
    showMiniCart = false;
    searchQuery = '';

    toggleMiniCart() {
        this.showMiniCart = !this.showMiniCart;
    }

    goToCart() {
        this.router.navigate([RouterConstant.cart]);
    }


    isLoggedIn(): boolean {
        return this.authService.isLoggedIn();
    }

    isAdmin(): boolean {
        return this.authService.isAdmin();
    }

    getCurrentUser() {
        return this.authService.getCurrentUser();
    }

    logout() {
        this.authService.logout();
    }

    onSearch() {
        console.log('Header search clicked, query:', this.searchQuery);
        if (this.searchQuery.trim()) {
            console.log('Navigating to products with search:', this.searchQuery.trim());
            this.router.navigate(['/Danh-muc-san-pham'], { 
                queryParams: { search: this.searchQuery.trim() } 
            });
        }
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event) {
        const target = event.target as HTMLElement;
        if (!target.closest('.cart-dropdown') && !target.closest('.cart-button')) {
            this.showMiniCart = false;
        }
    }
}
