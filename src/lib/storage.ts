import type { Bookmark, Category } from '@/types';

const STORAGE_KEYS = {
  CATEGORIES: 'bookmark_categories',
  BOOKMARKS: 'bookmark_links',
} as const;

export const getCategories = (): Category[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!stored) {
      const defaultCategories: Category[] = [
        { id: 'dev', name: '개발', order: 0 },
        { id: 'study', name: '공부', order: 1 },
      ];
      saveCategories(defaultCategories);
      return defaultCategories;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to get categories:', error);
    return [];
  }
};

export const saveCategories = (categories: Category[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (error) {
    console.error('Failed to save categories:', error);
  }
};

export const addCategory = (
  category: Omit<Category, 'id' | 'order'>,
): Category => {
  const categories = getCategories();
  const newCategory: Category = {
    ...category,
    id: `cat_${Date.now()}`,
    order: categories.length,
  };
  saveCategories([...categories, newCategory]);
  return newCategory;
};

export const updateCategory = (
  id: string,
  updates: Partial<Category>,
): void => {
  const categories = getCategories();
  const updated = categories.map((cat) =>
    cat.id === id ? { ...cat, ...updates } : cat,
  );
  saveCategories(updated);
};

export const deleteCategory = (id: string): void => {
  const categories = getCategories();
  const filtered = categories.filter((cat) => cat.id !== id);
  const reordered = filtered.map((cat, index) => ({ ...cat, order: index }));
  saveCategories(reordered);

  const bookmarks = getBookmarks();
  const updated = bookmarks.map((bookmark) =>
    bookmark.categoryId === id
      ? { ...bookmark, categoryId: 'uncategorized' }
      : bookmark,
  );
  saveBookmarks(updated);
};

export const getBookmarks = (): Bookmark[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (!stored) {
      const defaultBookmarks: Bookmark[] = [];
      saveBookmarks(defaultBookmarks);
      return defaultBookmarks;
    }

    const parsed = JSON.parse(stored);

    return parsed.map((bookmark: Bookmark) => ({
      ...bookmark,
      createdAt: new Date(bookmark.createdAt),
    }));
  } catch (error) {
    console.error('Failed to get bookmarks:', error);
    return [];
  }
};

export const saveBookmarks = (bookmarks: Bookmark[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  } catch (error) {
    console.error('Failed to save bookmarks:', error);
  }
};

export const addBookmark = (
  bookmark: Omit<Bookmark, 'id' | 'order' | 'createdAt'>,
): Bookmark => {
  const bookmarks = getBookmarks();
  const categoryBookmarks = bookmarks.filter(
    (b) => b.categoryId === bookmark.categoryId,
  );

  const newBookmark: Bookmark = {
    ...bookmark,
    id: `bm_${Date.now()}`,
    order: categoryBookmarks.length,
    createdAt: new Date(),
  };

  saveBookmarks([...bookmarks, newBookmark]);
  return newBookmark;
};

export const updateBookmark = (
  id: string,
  updates: Partial<Bookmark>,
): void => {
  const bookmarks = getBookmarks();
  const updated = bookmarks.map((bookmark) =>
    bookmark.id === id ? { ...bookmark, ...updates } : bookmark,
  );
  saveBookmarks(updated);
};

export const deleteBookmark = (id: string): void => {
  const bookmarks = getBookmarks();
  const filtered = bookmarks.filter((bookmark) => bookmark.id !== id);
  saveBookmarks(filtered);
};

export const toggleFavorite = (id: string): void => {
  const bookmarks = getBookmarks();
  const updated = bookmarks.map((bookmark) =>
    bookmark.id === id
      ? { ...bookmark, isFavorite: !bookmark.isFavorite }
      : bookmark,
  );
  saveBookmarks(updated);
};

export const getBookmarksByCategory = (
  categoryId: string | null,
): Bookmark[] => {
  const bookmarks = getBookmarks();

  if (categoryId === 'all' || categoryId === null) {
    return bookmarks.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  if (categoryId === 'favorites') {
    return bookmarks
      .filter((b) => b.isFavorite)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  return bookmarks
    .filter((b) => b.categoryId === categoryId)
    .sort((a, b) => a.order - b.order);
};

export const searchCategories = (query: string): Category[] => {
  const categories = getCategories();
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) {
    return categories;
  }

  return categories.filter((category) =>
    category.name.toLowerCase().includes(lowerQuery),
  );
};

export const searchBookmarks = (query: string): Bookmark[] => {
  const bookmarks = getBookmarks();
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) {
    return [];
  }

  return bookmarks.filter((bookmark) => {
    return (
      bookmark.title.toLowerCase().includes(lowerQuery) ||
      bookmark.url.toLowerCase().includes(lowerQuery) ||
      bookmark.description?.toLowerCase().includes(lowerQuery)
    );
  });
};
