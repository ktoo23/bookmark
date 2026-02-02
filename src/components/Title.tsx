import { useBookmarkStore } from '@/hooks/use-bookmark-store';
import type { Category } from '@/types';
import { useRef, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';

interface TitleProps {
  initialData: Category;
}

export default function Title({ initialData }: TitleProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { updateCategory, selectedCategoryId } = useBookmarkStore();

  const [title, setTitle] = useState(initialData.name || 'Untitled');
  const [isEditing, setIsEditing] = useState(false);

  const enableInput = () => {
    setTitle(initialData.name);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    if (selectedCategoryId) {
      updateCategory(selectedCategoryId, {
        name: event.target.value || 'Untitled',
      });
    }
  };

  const onKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      disableInput();
    }
  };

  if (selectedCategoryId === 'favorites' || selectedCategoryId === 'all') {
    return (
      <span className='truncate font-normal text-sm p-1'>
        {initialData.name}
      </span>
    );
  }

  return (
    <div className='flex items-center gap-x-1'>
      {!!initialData.icon && <p>{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeydown}
          value={title}
          className='h-7 px-2 focus-visible:ring-transparent'
        />
      ) : (
        <Button
          onClick={enableInput}
          variant='ghost'
          className='font-normal h-auto p-1'
        >
          <span className='truncate'>{initialData.name}</span>
        </Button>
      )}
    </div>
  );
}

Title.Skeleton = function TitleSkeleton() {
  return <Skeleton className='h-6 w-20 rounded-md' />;
};
