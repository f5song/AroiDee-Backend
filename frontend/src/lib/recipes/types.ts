// lib/recipes/types.ts
// ไม่มีการเปลี่ยนแปลงจากไฟล์เดิม - เก็บเฉพาะ types หลักเท่านั้น

/**
 * สูตรอาหาร
 */
export interface Recipe {
  id: number;
  description: string;
  title: string;
  calories: number;
  time: number;
  image: string;
  rating: number;
  difficulty: string;
  tags: string[];
}

/**
 * ข้อมูลการแบ่งหน้า
 */
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

/**
 * ตัวเลือกการกรอง
 */
export interface FilterOptions {
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
  cookingTime?: number;
  difficulty?: string;
  calorieRange?: number;
}

/**
 * ตัวเลือกการเรียงลำดับ
 */
export interface SortOption {
  value: string;
  label: string;
}

/**
 * แผนผังสีของแท็ก
 */
export interface TagColorMap {
  [key: string]: string;
}

/**
 * แผนผังหมวดหมู่
 */
export interface CategoryMap {
  [key: string]: string;
}

/**
 * ตัวเลือกหมวดหมู่
 */
export interface CategoryOption {
  id: string;
  name: string;
  group: string;
}

/**
 * ชนิดของแหล่งสูตรอาหาร
 */
export enum RecipeSource {
  ALL = 'all',
  USER = 'user',
  FAVORITE = 'favorite'
}