import { useBookmarkStore } from '@/hooks/use-bookmark-store';
import { useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

export default function Toolbar() {
  const { getSelectedCategory, updateCategory } = useBookmarkStore();
  const category = getSelectedCategory();

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(category?.name);

  const enableInput = () => {
    setIsEditing(true);
    setTimeout(() => {
      setValue(category?.name);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => {
    setIsEditing(false);
  };

  const onInput = (value: string) => {
    setValue(value);
    if (category?.id) {
      updateCategory(category.id, { name: value || 'Untitled' });
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      disableInput();
    }
  };

  if (category?.id === 'favorites' || category?.id === 'all') {
    return (
      <div className='pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F]'>
        {category?.name}
      </div>
    );
  }

  return (
    <div className='group relative'>
      {isEditing ? (
        <TextareaAutosize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e) => onInput(e.target.value)}
          className='text-5xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] resize-none'
        />
      ) : (
        <div
          onClick={enableInput}
          className='pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3F3F3F]'
        >
          {category?.name}
        </div>
      )}
    </div>
  );
}
