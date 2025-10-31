import { Component, Input } from '@angular/core';
import { Category } from '../../interfaces/category.interface';

@Component({
  selector: 'app-category-card',
  imports: [],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.css'
})
export class CategoryCardComponent {
  @Input({ required: true }) category!: Category;
}
