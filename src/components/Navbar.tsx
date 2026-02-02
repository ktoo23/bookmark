import { useBookmarkStore } from '@/hooks/use-bookmark-store';
import { MenuIcon } from 'lucide-react';
import Title from './Title';

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}
export default function Navbar({ isCollapsed, onResetWidth }: NavbarProps) {
  const { getSelectedCategory } = useBookmarkStore();

  const category = getSelectedCategory();

  if (category === undefined) {
    return (
      <nav className='bg-background px-3 py-2 w-full flex items-center'>
        <Title.Skeleton />
      </nav>
    );
  }

  return (
    <>
      <nav className='bg-background px-3 py-2 w-full flex items-center gap-x-4'>
        {isCollapsed && (
          <MenuIcon
            role='button'
            onClick={onResetWidth}
            className='size-6 text-muted-foreground'
          />
        )}

        <div className='flex items-center justify-between w-full'>
          {category && <Title initialData={category} />}
        </div>
      </nav>
    </>
  );
}
