import { Star, Trash2 } from 'lucide-react';
import type { Bookmark } from '@/types';
import { useBookmarkStore } from '@/hooks/use-bookmark-store';
import { toast } from 'sonner';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';

interface BookmarkCardProps {
  bookmark: Bookmark;
}

export default function BookmarkCard({ bookmark }: BookmarkCardProps) {
  const { toggleFavorite, deleteBookmark } = useBookmarkStore();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const promise = new Promise((resolve) => {
      deleteBookmark(bookmark.id);
      resolve(bookmark.id);
    });

    toast.promise(promise, {
      loading: '삭제중...',
      success: '북마크가 삭제되었어요',
      error: 'Failed to delete bookmark.',
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleFavorite(bookmark.id);
    toast.success(
      bookmark.isFavorite
        ? '즐겨찾기에서 해제되었어요'
        : '즐겨찾기에 추가되었어요',
    );
  };

  return (
    <HoverCard openDelay={500} closeDelay={100}>
      <HoverCardTrigger asChild>
        <a
          href={bookmark.url}
          target='_blank'
          rel='noopener noreferrer'
          className='group flex items-start gap-4 bg-card border border-border rounded-[10px] hover:bg-accent/50 transition-all h-[106px] mb-1.5'
        >
          {bookmark.thumbnail && (
            <div className='hidden md:block flex-shrink-0 w-[220px] h-full aspect-auto overflow-hidden bg-muted'>
              <img
                src={bookmark.thumbnail}
                alt=''
                className='block size-full object-cover rounded-l-[10px]'
                onError={(e) => {
                  e.currentTarget.parentElement!.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className='flex-1 min-w-0 p-3'>
            <h3 className='text-sm font-medium text-foreground line-clamp-2 mb-1'>
              {bookmark.title}
            </h3>

            {bookmark.description && (
              <p className='text-xs text-muted-foreground line-clamp-2 mb-2'>
                {bookmark.description}
              </p>
            )}

            <div className='flex items-center gap-1.5'>
              {bookmark.favicon && (
                <img
                  src={bookmark.favicon}
                  alt=''
                  className='size-4 object-contain'
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <p className='text-xs text-muted-foreground truncate'>
                {bookmark.url}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 pt-3 pr-3'>
            <button
              onClick={handleToggleFavorite}
              className={`p-1.5 rounded-md hover:bg-muted transition-colors ${
                bookmark.isFavorite
                  ? 'text-yellow-500'
                  : 'text-muted-foreground'
              }`}
            >
              <Star
                className={`size-4 ${bookmark.isFavorite ? 'fill-current' : ''}`}
              />
            </button>

            <button
              onClick={handleDelete}
              className='p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive transition-colors'
            >
              <Trash2 className='size-4' />
            </button>
          </div>
        </a>
      </HoverCardTrigger>

      <HoverCardContent
        side='bottom'
        align='end'
        className='w-[300px] p-0 overflow-hidden bg-background'
        sideOffset={10}
      >
        <div className='relative'>
          <img
            src={bookmark.screenshot}
            alt={`Preview of ${bookmark.title}`}
            className='w-full h-full object-cover'
            loading='lazy'
          />
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
