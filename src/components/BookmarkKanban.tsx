import { useBookmarkStore } from '@/hooks/use-bookmark-store';
import BookmarkCard from './BookmarkCard';
import { useCallback, useMemo } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import * as storage from '@/lib/storage';

export default function BookmarkKanban() {
  const { bookmarks, selectedCategoryId, updateBookmark } = useBookmarkStore();

  const items = useMemo(() => {
    return storage.getBookmarksByCategory(selectedCategoryId);
  }, [bookmarks, selectedCategoryId]);

  // 개별 카테고리에서만 드래그 가능
  const isDraggable =
    selectedCategoryId !== 'all' && selectedCategoryId !== 'favorites';

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination || !isDraggable) {
        return;
      }

      const { source, destination } = result;
      if (source.index === destination.index) {
        return;
      }

      const newItems = [...items];
      const [movedItem] = newItems.splice(source.index, 1);

      if (!movedItem) {
        return;
      }

      newItems.splice(destination.index, 0, movedItem);

      newItems.forEach((item, index) => {
        if (item.order !== index) {
          updateBookmark(item.id, { order: index });
        }
      });
    },
    [items, updateBookmark, isDraggable],
  );

  return (
    <div className='mt-8'>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable'>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items.map((bookmark, index) => (
                <Draggable
                  key={bookmark.id}
                  draggableId={bookmark.id}
                  index={index}
                  isDragDisabled={!isDraggable}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <BookmarkCard bookmark={bookmark} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
