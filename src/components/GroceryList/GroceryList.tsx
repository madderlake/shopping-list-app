import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import ListItem from './ListItem';

const API_URL = 'https://api.spoonacular.com/food/ingredients/autocomplete';
const API_KEY = '8a73ab009797491a83fff7f7d5656bc8'; // Replace with your Spoonacular API key

type FoodItem = {
  name: string;
};

export type GroceryItem = {
  text: string;
  quantity: number;
  checked: boolean;
};
const GroceryList = () => {
  const [listItems, setListItems] = useState<GroceryItem[]>([]);
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
    setListItems([
      ...listItems,
      { text: suggestion, quantity: 1, checked: false },
    ]);
    setValue('');
    setSuggestions([]);
  };

  const handleDragStart = (ev: React.DragEvent<HTMLLIElement>) => {
    setDragId(ev.currentTarget.id);
  };

  const handleDragOver = (ev: React.DragEvent<HTMLLIElement>) => {
    setDragOverId(ev.currentTarget.id);
  };

  const handleDrop = () => {
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

  const updateItemQuantity = (
    index: number,
    ev: ChangeEvent<HTMLInputElement>
  ) => {
    const copyListItems = [...listItems];
    copyListItems.map((item, i) => {
      if (i === index) item.quantity = Number(ev.target.value);
    });
    return setListItems(copyListItems);
  };

  return (
    <div>
      <div className="grocery-list-wrapper">
        <h1>Grocery List</h1>
        <ul ref={listRef} className="grocery-list">
          {listItems.map((_, index) => {
            return (
              <ListItem
                id={`item-${index}`}
                key={`i${index}`}
                index={index}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDelete={handleDeleteItem}
                updateQuantity={updateItemQuantity}
                text={listItems[index].text}
                quantity={listItems[index].quantity}
                checked={listItems[index].checked}
              />
            );
          })}
        </ul>
      </div>
      <div className="user-selection">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Type to find items..."
        />
        <ul className={`suggestion-list ${value !== '' && 'open'}`}>
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => onSuggestionSelected(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroceryList;
