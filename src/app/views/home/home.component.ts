import { Component } from '@angular/core';
import { HeroComponent } from "../../components/hero/hero.component";
import { BlogComponent } from "../../components/blog/blog.component";
import { FeaturedProductsComponent } from "../../components/featured-products/featured-products.component";
import { NewsletterComponent } from "../../components/newsletter/newsletter.component";

@Component({
  selector: 'app-home',
  imports: [HeroComponent, BlogComponent, FeaturedProductsComponent, NewsletterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
