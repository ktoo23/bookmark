import {
  ChevronLeft,
  PlusCircle,
  Search,
  Folder,
  Star,
  MenuIcon,
} from 'lucide-react';
import type { Category } from '../types';
import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { cn } from '@/lib/utils';
import Item from './item';
import CategoryList from './CategoryList';
import { useSearch } from '@/hooks/use-search';
import { useBookmarkStore } from '@/hooks/use-bookmark-store';
import Navbar from './Navbar';

interface SidebarProps {
  categories: Category[];
}

export default function Sidebar({ categories }: SidebarProps) {
  const search = useSearch();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { selectedCategoryId, selectCategory, addCategory } =
    useBookmarkStore();

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? '100%' : '240px';
      navbarRef.current.style.setProperty(
        'width',
        isMobile ? '0' : 'calc(100% - 240px)',
      );
      navbarRef.current.style.setProperty('left', isMobile ? '100%' : '240px');

      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = '0';
      navbarRef.current.style.setProperty('width', '100%');
      navbarRef.current.style.setProperty('left', '0');
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) {
      return;
    }

    let newWidth = e.clientX;

    if (newWidth < 240) {
      newWidth = 240;
    }

    if (newWidth > 480) {
      newWidth = 480;
    }

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;

      navbarRef.current.style.setProperty('left', `${newWidth}px`);
      navbarRef.current.style.setProperty(
        'width',
        `calc(100% - ${newWidth}px)`,
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleCreate = () => {
    const newCategory = addCategory();
    selectCategory(newCategory.id);
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          'group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]',
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'w-0',
        )}
      >
        <div
          role='button'
          onClick={collapse}
          className={cn(
            'size-6 text-muted-foreground rounded-sm hover:bg-neutral-300 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition',
            isMobile && 'opacity-100',
          )}
        >
          <ChevronLeft className='size-6' />
        </div>

        <div className='mt-9'>
          <Item onClick={search.onOpen} isSearch label='Search' icon={Search} />
          <Item
            onClick={() => selectCategory('all')}
            label='All Bookmarks'
            icon={Folder}
            active={selectedCategoryId === 'all'}
          />
          <Item
            onClick={() => selectCategory('favorites')}
            label='Favorites'
            icon={Star}
            active={selectedCategoryId === 'favorites'}
          />
        </div>

        <div className='mt-4'>
          <div className='px-3 py-2'>
            <p className='text-xs font-semibold text-muted-foreground uppercase'>
              카테고리
            </p>
          </div>
          <CategoryList categories={categories} />
          <Item onClick={handleCreate} label='New Category' icon={PlusCircle} />
        </div>

        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className='opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0'
        />
      </aside>

      <div
        ref={navbarRef}
        className={cn(
          'absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]',
          isResetting && 'transition-all ease-in-out duration-300',
          isMobile && 'left-0 w-full',
        )}
      >
        {selectedCategoryId ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        ) : (
          <nav className='bg-transparent px-3 py-2 w-full'>
            {isCollapsed && (
              <MenuIcon
                onClick={resetWidth}
                className='size-6 text-muted-foreground cursor-pointer'
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
}
