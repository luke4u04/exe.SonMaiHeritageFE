import { Routes } from '@angular/router';
import { RouterConstant } from './constants/routerConstants';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { ProductCategoryComponent } from './views/product-category/product-category.component';
import { CartComponent } from './views/cart/cart.component';
import { ProductDetailComponent } from './views/product-detail/product-detail.component';
import { CheckoutComponent } from './views/checkout/checkout.component';
import { PaymentResultComponent } from './views/payment-result/payment-result.component';
import { OrderTestComponent } from './views/order-test/order-test.component';
import { OrderDebugComponent } from './views/order-debug/order-debug.component';
import { ApiTestComponent } from './views/api-test/api-test.component';
import { OrdersComponent } from './views/orders/orders.component';
import { BlogDetailComponent } from './views/blog-detail/blog-detail.component';
import { OrderLookupComponent } from './views/order-lookup/order-lookup.component';
import { AdminLayoutComponent } from './views/admin/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './views/admin/dashboard/dashboard.component';
import { AdminOrdersComponent } from './views/admin/orders/orders.component';
import { AdminPaymentsComponent } from './views/admin/payments/payments.component';
import { AddProductComponent } from './views/admin/add-product/add-product.component';
import { ProductsComponent } from './views/admin/products/products.component';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: '', redirectTo: RouterConstant.home, pathMatch: 'full' },
    { path: RouterConstant.login, component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: RouterConstant.home, component: HomeComponent },
    { path: RouterConstant.productCategory, component: ProductCategoryComponent},
    { path: RouterConstant.cart, component: CartComponent},
    { path: 'checkout', component: CheckoutComponent},
    { path: 'payment-result', component: PaymentResultComponent},
    { path: 'order-test', component: OrderTestComponent},
    { path: 'order-debug', component: OrderDebugComponent},
    { path: 'api-test', component: ApiTestComponent},
    { path: 'orders', component: OrdersComponent},
    { path: 'tra-cuu-don-hang', component: OrderLookupComponent},
    { path: RouterConstant.detailProduct, component: ProductDetailComponent },
    { path: RouterConstant.blogDetail, component: BlogDetailComponent },
    { path: 'blog/son-mai-truyen-thong', component: BlogDetailComponent },
    
    // Admin routes
    {
        path: 'admin',
        component: AdminLayoutComponent,
        canActivate: [AdminGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AdminDashboardComponent },
            { path: 'orders', component: AdminOrdersComponent },
            { path: 'payments', component: AdminPaymentsComponent },
            { path: 'statistics', component: AdminDashboardComponent },
            { path: 'products', component: ProductsComponent },
            { path: 'add-product', component: AddProductComponent }
        ]
    },
    
    { path: '**', redirectTo: RouterConstant.home }
];
