import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterGroup } from '../../interfaces/filterGroup.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-sidebar',
  imports: [CommonModule],
  templateUrl: './filter-sidebar.component.html',
  styleUrl: './filter-sidebar.component.css'
})
export class FilterSidebarComponent {
  @Input() filterGroups: FilterGroup[] = [];
  @Input() selectedFilters: { [key: string]: string[] } = {};
  @Output() filtersChanged = new EventEmitter<{ [key: string]: string[] }>();

  expandedGroups: { [key: string]: boolean } = {};

  ngOnInit() {
    // Expand all groups by default
    this.filterGroups.forEach(group => {
      this.expandedGroups[group.key] = true;
    });
  }

  toggleGroup(key: string) {
    this.expandedGroups[key] = !this.expandedGroups[key];
  }

  isFilterSelected(groupKey: string, optionId: string): boolean {
    return this.selectedFilters[groupKey]?.includes(optionId) || false;
  }

  onFilterChange(groupKey: string, optionId: string, event: any) {
    const isChecked = event.target.checked;
    const currentFilters = { ...this.selectedFilters };
    
    if (!currentFilters[groupKey]) {
      currentFilters[groupKey] = [];
    }

    if (isChecked) {
      if (!currentFilters[groupKey].includes(optionId)) {
        currentFilters[groupKey] = [...currentFilters[groupKey], optionId];
      }
    } else {
      currentFilters[groupKey] = currentFilters[groupKey].filter(id => id !== optionId);
      if (currentFilters[groupKey].length === 0) {
        delete currentFilters[groupKey];
      }
    }

    this.selectedFilters = currentFilters;
    this.filtersChanged.emit(this.selectedFilters);
  }

  hasActiveFilters(): boolean {
    return Object.keys(this.selectedFilters).some(key => 
      this.selectedFilters[key] && this.selectedFilters[key].length > 0
    );
  }

  clearAllFilters() {
    this.selectedFilters = {};
    this.filtersChanged.emit(this.selectedFilters);
  }

  removeFilter(groupKey: string, optionId: string) {
    const currentFilters = { ...this.selectedFilters };
    if (currentFilters[groupKey]) {
      currentFilters[groupKey] = currentFilters[groupKey].filter(id => id !== optionId);
      if (currentFilters[groupKey].length === 0) {
        delete currentFilters[groupKey];
      }
    }
    this.selectedFilters = currentFilters;
    this.filtersChanged.emit(this.selectedFilters);
  }

  getActiveFilterLabels(): { label: string; key: string; value: string }[] {
    const labels: { label: string; key: string; value: string }[] = [];
    
    Object.keys(this.selectedFilters).forEach(groupKey => {
      const group = this.filterGroups.find(g => g.key === groupKey);
      if (group) {
        this.selectedFilters[groupKey].forEach(optionId => {
          const option = group.options.find(o => o.id === optionId);
          if (option) {
            labels.push({
              label: `${group.title}: ${option.name}`,
              key: groupKey,
              value: optionId
            });
          }
        });
      }
    });
    
    return labels;
  }
}
