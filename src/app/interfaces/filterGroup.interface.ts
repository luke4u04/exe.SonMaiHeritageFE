import { FilterOption } from "./filterOption.interface";

export interface FilterGroup {
  title: string;
  key: string;
  options: FilterOption[];
}