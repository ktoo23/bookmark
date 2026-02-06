import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateBookmarkModal } from '@/hooks/use-create-bookmark-modal';
import { Loader2, PlusIcon } from 'lucide-react';
import { Field, FieldDescription, FieldGroup } from './ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useState } from 'react';
import { useBookmarkStore } from '@/hooks/use-bookmark-store';
import { fetchMetadata } from '@/lib/metadata';
import { toast } from 'sonner';

export default function CreateBookmarkModal() {
  const { isOpen, setIsOpen } = useCreateBookmarkModal();
  const { categories, addBookmark } = useBookmarkStore();

  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error('추가할 북마크 URL을 입력해주세요');
      return;
    }

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    try {
      new URL(finalUrl);
    } catch {
      toast.error('올바른 형식의 URL을 입력해주세요');
      return;
    }

    setIsLoading(true);
    try {
      const metadata = await fetchMetadata(finalUrl);

      const parsedTags = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      addBookmark({
        url: metadata.url,
        title: metadata.title,
        description: metadata.description,
        favicon: metadata.favicon,
        thumbnail: metadata.image,
        screenshot: metadata.screenshot,
        categoryId: selectedCategoryId || 'uncategorized',
        isFavorite: false,
        tags: parsedTags.length > 0 ? parsedTags : undefined,
      });

      toast.success('북마크가 추가되었어요');
      setIsOpen(false);
      setUrl('');
      setSelectedCategoryId('');
      setTags('');
    } catch (error) {
      toast.error('북마크 추가에 실패했어요');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size='sm' variant='secondary'>
          <PlusIcon className='size-4' /> 추가
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-sm'>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>북마크 추가</DialogTitle>
            <DialogDescription>
              카테고리에 북마크를 추가하세요
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className='py-4'>
            <Field>
              <Label htmlFor='url'>Url</Label>
              <Input
                id='url'
                name='url'
                type='text'
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder='Paste URL here (e.g., youtube.com or https://youtube.com)...'
              />
            </Field>
            <Field>
              <Label>Category</Label>
              <Select
                value={selectedCategoryId}
                name='category'
                onValueChange={(value) => setSelectedCategoryId(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='카테고리 선택' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                    <SelectItem value='uncategorized'>해당없음</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <Label htmlFor='tags'>Tag</Label>

              <Input
                id='tags'
                name='tags'
                placeholder='예) 공부,신입,개발'
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <FieldDescription className='text-xs'>
                여러 태그는 쉼표로 구분해주세요
              </FieldDescription>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='outline'>
                취소
              </Button>
            </DialogClose>
            <Button type='submit' variant='secondary' disabled={isLoading}>
              {isLoading ? <Loader2 className='size-4 animate-spin' /> : null}
              추가
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
