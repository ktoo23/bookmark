// hooks/use-bookmark-store.ts
import { create } from 'zustand';
import type { Bookmark, Category } from '@/types';
import * as storage from '@/lib/storage';

interface BookmarkStore {
  categories: Category[];
  bookmarks: Bookmark[];
  selectedCategoryId: string;

  loadCategories: () => void;
  addCategory: (icon?: string) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  loadBookmarks: () => void;
  addBookmark: (
    bookmark: Omit<Bookmark, 'id' | 'order' | 'createdAt'>,
  ) => Bookmark;
  updateBookmark: (id: string, updates: Partial<Bookmark>) => void;
  deleteBookmark: (id: string) => void;
  toggleFavorite: (id: string) => void;

  selectCategory: (id: string) => void;

  getSelectedCategory: () => Category | null;
  getFilteredBookmarks: () => Bookmark[];
}

export const useBookmarkStore = create<BookmarkStore>((set, get) => ({
  categories: [],
  bookmarks: [],
  selectedCategoryId: 'all',

  // Categories
  loadCategories: () => {
    const categories = storage.getCategories();
    set({ categories });
  },

  addCategory: (icon?: string) => {
    const newCategory = storage.addCategory({ name: 'Untitled', icon });
    set((state) => ({
      categories: [...state.categories, newCategory],
    }));
    return newCategory;
  },

  updateCategory: (id: string, updates: Partial<Category>) => {
    storage.updateCategory(id, updates);
    set((state) => ({
      categories: state.categories.map((cat) =>
        cat.id === id ? { ...cat, ...updates } : cat,
      ),
    }));
  },

  deleteCategory: (id: string) => {
    storage.deleteCategory(id);
    set((state) => ({
      categories: state.categories.filter((cat) => cat.id !== id),
      selectedCategoryId:
        state.selectedCategoryId === id ? 'all' : state.selectedCategoryId,
    }));
    get().loadBookmarks();
  },

  // Bookmarks
  loadBookmarks: () => {
    const bookmarks = storage.getBookmarks();
    set({ bookmarks });
  },

  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'order' | 'createdAt'>) => {
    const newBookmark = storage.addBookmark(bookmark);
    set((state) => ({
      bookmarks: [...state.bookmarks, newBookmark],
    }));
    return newBookmark;
  },

  updateBookmark: (id: string, updates: Partial<Bookmark>) => {
    storage.updateBookmark(id, updates);
    set((state) => ({
      bookmarks: state.bookmarks.map((bookmark) =>
        bookmark.id === id ? { ...bookmark, ...updates } : bookmark,
      ),
    }));
  },

  deleteBookmark: (id: string) => {
    storage.deleteBookmark(id);
    set((state) => ({
      bookmarks: state.bookmarks.filter((bookmark) => bookmark.id !== id),
    }));
  },

  toggleFavorite: (id: string) => {
    storage.toggleFavorite(id);
    set((state) => ({
      bookmarks: state.bookmarks.map((bookmark) =>
        bookmark.id === id
          ? { ...bookmark, isFavorite: !bookmark.isFavorite }
          : bookmark,
      ),
    }));
  },

  // Selection
  selectCategory: (id: string) => {
    set({ selectedCategoryId: id });
  },

  // Getters
  getSelectedCategory: () => {
    const { categories, selectedCategoryId } = get();

    if (selectedCategoryId === 'all') {
      return { id: 'all', name: 'All Bookmarks', order: -2 };
    }

    if (selectedCategoryId === 'favorites') {
      return { id: 'favorites', name: 'Favorites', order: -1 };
    }

    return categories.find((cat) => cat.id === selectedCategoryId) || null;
  },

  getFilteredBookmarks: () => {
    const { selectedCategoryId } = get();
    return storage.getBookmarksByCategory(selectedCategoryId);
  },
}));
