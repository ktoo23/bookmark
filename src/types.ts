export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  order: number;
}

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description?: string;
  favicon?: string;
  thumbnail?: string;
  screenshot?: string;
  categoryId: string;
  isFavorite: boolean;
  tags?: string[];
  order: number;
  createdAt: Date;
}
