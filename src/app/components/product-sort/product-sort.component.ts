import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-product-sort',
  imports: [CommonModule],
  templateUrl: './product-sort.component.html',
  styleUrl: './product-sort.component.css'
})
export class ProductSortComponent {
  @Input() sortOption = 'newest';
  @Output() sortChanged = new EventEmitter<string>();

  onSortChange(event: any) {
    const newSortOption = event.target.value;
    this.sortOption = newSortOption;
    this.sortChanged.emit(newSortOption);
  }
}
