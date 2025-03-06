export interface Recipe {
    id: number;
    title: string;
    calories: number;
    time: number;
    image: string;
    rating: number;
    difficulty: string;
    tags: string[];
  }
  
  export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  }
  
  export interface FilterOptions {
    category: string;
    search: string;
    sort: string;
    page: number;
  }
  
  export interface TagColorMap {
    [key: string]: string;
  }
  
  export interface CategoryMap {
    [key: string]: string;
  }
  
  export interface SortOption {
    value: string;
    label: string;
  }

  export interface ExploreSidebarProps {
    onCategoryChange: (category: string) => void;
    onSearch: (query: string) => void;
    onAdvancedFiltersChange?: (filters: AdvancedFilters) => void;
    onSidebarToggle?: (isOpen: boolean) => void; // เพิ่ม prop นี้
  }