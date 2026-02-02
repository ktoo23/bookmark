import Toolbar from './Toolbar';
import AddBookmarkForm from './AddBookmarkForm';
import BookmarkKanban from './BookmarkKanban';

export default function BookmarkList() {
  return (
    <div className='pb-40'>
      <div className='h-[35px]' />
      <div>
        <Toolbar />
        <AddBookmarkForm />
        <BookmarkKanban />
      </div>
    </div>
  );
}
