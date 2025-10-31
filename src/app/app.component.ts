import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { CommonModule } from '@angular/common';
import { HeroComponent } from './components/hero/hero.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { FeaturedProductsComponent } from './components/featured-products/featured-products.component';
import { NewsletterComponent } from './components/newsletter/newsletter.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from "./views/home/home.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SƠN MÀI HERITAGE';
}
