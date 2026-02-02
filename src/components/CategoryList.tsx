import type { Category } from '@/types';
import Item from './item';
import { Folder } from 'lucide-react';
import { useBookmarkStore } from '@/hooks/use-bookmark-store';

interface CategoryListProps {
  categories: Category[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  const { selectedCategoryId, selectCategory } = useBookmarkStore();

  if (categories == null || categories.length === 0) {
    return (
      <>
        <Item.Skeleton />
        <Item.Skeleton />
      </>
    );
  }

  return (
    <>
      {categories.map((category) => (
        <div key={category.id}>
          <Item
            onClick={() => selectCategory(category.id)}
            label={category.name}
            icon={Folder}
            categoryIcon={category.icon}
            active={selectedCategoryId === category.id}
            categoryId={category.id}
          />
        </div>
      ))}
    </>
  );
}
