import { Component, Input } from '@angular/core';
import { BreadcrumbItem } from '../../interfaces/breadcrumbItem.interface';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink, CommonModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent {
  @Input() breadcrumbs: BreadcrumbItem[] = [];
}
