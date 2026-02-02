import { cn } from '@/lib/utils';
import { Trash, type LucideIcon } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { toast } from 'sonner';
import { useBookmarkStore } from '@/hooks/use-bookmark-store';

interface ItemProps {
  label: string;
  categoryIcon?: string;
  active?: boolean;
  isSearch?: boolean;
  onClick?: () => void;
  icon: LucideIcon;
  categoryId?: string;
}

export default function Item({
  onClick,
  label,
  icon: Icon,
  active,
  categoryIcon,
  isSearch,
  categoryId,
}: ItemProps) {
  const { deleteCategory } = useBookmarkStore();

  const onDelete = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();

    if (!categoryId) return;

    const promise = new Promise((resolve, reject) => {
      try {
        deleteCategory(categoryId);
        resolve(categoryId);
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: 'Deleting category...',
      success: 'Category deleted!',
      error: 'Failed to delete category.',
    });
  };

  return (
    <div
      onClick={onClick}
      role='button'
      style={{ paddingLeft: '12px' }}
      className={cn(
        'group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium ',
        active && 'bg-primary/5 text-primary',
      )}
    >
      {categoryIcon ? (
        <div className='shrink-0 mr-2 text-[18px]'>{categoryIcon}</div>
      ) : (
        <Icon className='shrink-0 size-[18px] mr-2 text-muted-foreground' />
      )}
      <span className='truncate'>{label}</span>
      {isSearch && (
        <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
          <span className='text-xs'>⌘</span>K
        </kbd>
      )}
      {categoryId && (
        <div className='ml-auto flex items-center gap-x-2'>
          <div
            className='opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300'
            role='button'
            onClick={onDelete}
          >
            <Trash className='size-4 text-muted-foreground' />
          </div>
        </div>
      )}
    </div>
  );
}

Item.Skeleton = function ItemSkeleton() {
  return (
    <div style={{ paddingLeft: '12px' }} className='flex gap-x-2 py-[3px]'>
      <Skeleton className='size-4' />
      <Skeleton className='h-4 w-[30%]' />
    </div>
  );
};
