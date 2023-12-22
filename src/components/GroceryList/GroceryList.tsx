import React, { useState, useEffect, useRef } from 'react';
// import GroceryListItem from './GroceryListItem';

const API_URL = 'https://api.spoonacular.com/food/ingredients/autocomplete';
const API_KEY = '8a73ab009797491a83fff7f7d5656bc8'; // Replace with your Spoonacular API key
// import type { GroceryListItemProps } from './GroceryListItem';
type FoodItem = {
  name: string;
};
const GroceryList = () => {
  const [listItems, setListItems] = useState<string[]>([]);
  const [value, setValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [dragId, setDragId] = useState<string>('');
  const [dragOverId, setDragOverId] = useState<string>('');

  const listRef = useRef<HTMLUListElement>(null);
  let debouncer: ReturnType<typeof setTimeout>;

  useEffect(() => {
    debouncer = setTimeout(() => {
      if (value.trim() !== '') {
        fetchSuggestions(value);
      }
    }, 500);
    return () => {
      clearTimeout(debouncer);
    };
  }, [value]);

  const listElements = listRef.current?.children as HTMLCollection;

  const getElementIndex = (id: string) => {
    return Array.from(listElements)
      .map((item, i) => (item.id == id ? i : 0))
      .reduce((acc, curr) => acc + curr);
  };

  const fetchSuggestions = async (query: string) => {
    try {
      const response = await fetch(
        `${API_URL}?apiKey=${API_KEY}&query=${query}`
      );
      const data = await response.json();
      setSuggestions(data.map((item: FoodItem) => item.name));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const eventTarget = event.target as HTMLInputElement;
    setValue(eventTarget.value);
  };

  const onSuggestionSelected = (suggestion: string) => {
    setListItems([...listItems, suggestion]);
    setValue('');
    setSuggestions([]);
  };

  const handleDragStart = (ev: React.DragEvent<HTMLLIElement>) => {
    setDragId(ev.currentTarget.id);
  };

  const handleDragOver = (ev: React.DragEvent<HTMLLIElement>) => {
    setDragOverId(ev.currentTarget.id);
  };

  const handleDrop = (ev: React.DragEvent<HTMLLIElement>) => {
    const copyListItems = [...listItems];
    const dragItemIndex = getElementIndex(dragId);
    const dragOverItemIndex = getElementIndex(dragOverId);
    const dragItemContent = copyListItems[getElementIndex(dragId)];

    copyListItems.splice(dragItemIndex, 1);
    copyListItems.splice(dragOverItemIndex, 0, dragItemContent);
    // console.log(copyListItems);
    setListItems(copyListItems);
  };
  const ListItem = listItems.map((item, index) => {
    return (
      <li
        key={index}
        id={`item-${index}`}
        draggable
        onDragStart={(event) => handleDragStart(event)}
        onDragEnter={(event) => handleDragOver(event)}
        onDragEnd={handleDrop}
        style={{
          border: '1px lightgrey solid',
          listStyleType: 'none',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '5px',
          color: 'black',
          height: '40px',
        }}>
        {`${index + 1}.  ${item}`}
      </li>
    );
  });
  return (
    <div>
      <h1>Grocery List</h1>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Type to add items..."
      />
      <ul>
        {suggestions.map((suggestion, index) => (
          <li key={index} onClick={() => onSuggestionSelected(suggestion)}>
            {suggestion}
          </li>
        ))}
      </ul>
      <ul ref={listRef}>{React.Children.toArray(ListItem)}</ul>
    </div>
  );
};

export default GroceryList;
