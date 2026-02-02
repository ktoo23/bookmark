import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useBookmarkStore } from '@/hooks/use-bookmark-store';
import { fetchMetadata } from '@/lib/metadata';
import { toast } from 'sonner';

export default function AddBookmarkForm() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addBookmark, selectedCategoryId } = useBookmarkStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error('추가할 북마크 url을 입력해주세요');
      return;
    }

    // URL 형식 체크
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    setIsLoading(true);

    try {
      const metadata = await fetchMetadata(finalUrl);

      const targetCategoryId =
        selectedCategoryId === 'all' ? 'uncategorized' : selectedCategoryId;

      addBookmark({
        url: metadata.url,
        title: metadata.title,
        description: metadata.description,
        favicon: metadata.favicon,
        thumbnail: metadata.image,
        screenshot: metadata.screenshot,
        categoryId: targetCategoryId,
        isFavorite: false,
      });

      toast.success('북마크가 추가되었어요');
      setUrl('');
    } catch (error) {
      toast.error('Failed to add bookmark');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedCategoryId === 'favorites') {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className='mt-10'>
      <div className='flex gap-2'>
        <Input
          type='text'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder='Paste URL here (e.g., youtube.com or https://youtube.com)...'
          className='flex-1 focus-visible:ring-transparent'
          disabled={isLoading}
        />
        <Button
          type='submit'
          variant='secondary'
          disabled={isLoading || !url.trim()}
        >
          {isLoading ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            <Plus className='size-4 ' />
          )}
          추가
        </Button>
      </div>
    </form>
  );
}
