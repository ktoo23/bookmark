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

    try {
      deleteBookmark(bookmark.id);
      toast.success('북마크가 삭제되었어요');
    } catch (error) {
      toast.error('북마크 삭제에 실패했어요');
      console.error(error);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      toggleFavorite(bookmark.id);
      toast.success(
        bookmark.isFavorite
          ? '즐겨찾기에서 해제되었어요'
          : '즐겨찾기에 추가되었어요',
      );
    } catch (error) {
      toast.error('작업에 실패했어요');
      console.error(error);
    }
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

          {bookmark.tags && bookmark.tags.length > 0 && (
            <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3'>
              <div className='flex flex-wrap gap-1'>
                {bookmark.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className='inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/20 text-white backdrop-blur-sm'
                  >
                    #{tag}
                  </span>
                ))}
                {bookmark.tags.length > 3 && (
                  <span className='text-[10px] text-muted-foreground'>
                    +{bookmark.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
