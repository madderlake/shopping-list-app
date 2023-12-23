import React, { useState, useEffect, useRef } from 'react';
import ListItem from './ListItem';

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
    const dragItemText = copyListItems[getElementIndex(dragId)];

    copyListItems.splice(dragItemIndex, 1);
    copyListItems.splice(dragOverItemIndex, 0, dragItemText);
    setListItems(copyListItems);
  };

  const handleDeleteItem = (id: string) => {
    const copyListItems = [...listItems];
    copyListItems.splice(getElementIndex(id), 1);
    setListItems(copyListItems);
  };

  return (
    <div>
      <div className="user-selection">
        <h1>Grocery List</h1>
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Type to add items..."
        />
        <ul className={`suggestion-list ${value !== '' && 'open'}`}>
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => onSuggestionSelected(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
      <div className="grocer-list-wrapper">
        <ul ref={listRef} className="grocery-list">
          {listItems.map((_, index) => {
            return (
              <ListItem
                id={`item-${index}`}
                index={index}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDelete={handleDeleteItem}
                text={listItems[index]}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default GroceryList;
