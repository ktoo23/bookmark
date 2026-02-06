import { useSearch } from '@/hooks/use-search';
import { useEffect, useMemo, useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { File, Link as LinkIcon } from 'lucide-react';
import { useBookmarkStore } from '@/hooks/use-bookmark-store';
import * as storage from '@/lib/storage';

export default function SearchCommand() {
  const [search, setSearch] = useState('');

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);
  const { selectCategory } = useBookmarkStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggle]);

  const searchResults = useMemo(() => {
    if (search.trim()) {
      const categories = storage.searchCategories(search);
      const bookmarks = storage.searchBookmarks(search);
      return { categories, bookmarks };
    } else {
      return { categories: [], bookmarks: [] };
    }
  }, [search]);

  const onSelectCategory = (categoryId: string) => {
    selectCategory(categoryId);
    onClose();
    setSearch('');
  };

  const onSelectBookmark = (url: string) => {
    window.open(url, '_blank');
    onClose();
    setSearch('');
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput
        placeholder='카테고리 또는 북마크 검색...'
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found</CommandEmpty>

        {searchResults.categories.length > 0 && (
          <CommandGroup heading='Categories'>
            {searchResults.categories.map((category) => (
              <CommandItem
                key={category.id}
                value={category.name}
                onSelect={() => onSelectCategory(category.id)}
                className='cursor-pointer'
              >
                {category.icon ? (
                  <p className='mr-2 text-[18px]'>{category.icon}</p>
                ) : (
                  <File className='mr-2 size-4' />
                )}
                <span>{category.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {searchResults.bookmarks.length > 0 && (
          <CommandGroup heading='Bookmarks'>
            {searchResults.bookmarks.map((bookmark) => {
              const searchableValue = [
                bookmark.title,
                bookmark.url,
                bookmark.description,
                ...(bookmark.tags || []),
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <CommandItem
                  key={bookmark.id}
                  value={searchableValue}
                  onSelect={() => onSelectBookmark(bookmark.url)}
                  className='cursor-pointer'
                >
                  {bookmark.favicon ? (
                    <img
                      src={bookmark.favicon}
                      alt=''
                      className='mr-2 size-4 object-contain'
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <LinkIcon className='mr-2 size-4' />
                  )}
                  <div className='flex flex-col'>
                    <span className='font-medium'>{bookmark.title}</span>
                    <span className='text-xs text-muted-foreground truncate max-w-md'>
                      {bookmark.url}
                    </span>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
