import { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SearchCommand from './components/SearchCommand';
import { useBookmarkStore } from './hooks/use-bookmark-store';
import { Toaster } from 'sonner';
import BookmarkList from './components/BookmarkList';

function App() {
  const { categories, loadCategories, loadBookmarks } = useBookmarkStore();

  useEffect(() => {
    loadCategories();
    loadBookmarks();
  }, [loadCategories, loadBookmarks]);

  return (
    <>
      <div className='flex h-screen bg-background'>
        <Sidebar categories={categories} />

        <main className='flex-1 overflow-auto p-6'>
          <div className='max-w-[900px] mx-auto px-6 py-6'>
            <BookmarkList />
          </div>
        </main>
      </div>

      <SearchCommand />
      <Toaster position='top-center' />
    </>
  );
}

export default App;
