import Toolbar from './Toolbar';
import BookmarkKanban from './BookmarkKanban';
import CreateBookmarkModal from './CreateBookmarkModal';
import { useBookmarkStore } from '@/hooks/use-bookmark-store';

export default function BookmarkList() {
  const { selectedCategoryId } = useBookmarkStore();
  const canAddBookmark = selectedCategoryId !== 'favorites';
  return (
    <div className='pb-40'>
      <div className='h-[35px]' />
      <div>
        <Toolbar />
        {canAddBookmark ? <CreateBookmarkModal /> : null}
        {/* <AddBookmarkForm /> */}
        <BookmarkKanban />
      </div>
    </div>
  );
}
