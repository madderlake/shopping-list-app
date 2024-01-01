import {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  DragEvent,
  KeyboardEvent,
} from 'react';

import GroceryListItem from './GroceryListItem';

const API_URL = 'https://api.frontendeval.com/fake/food';

type GroceryItem = {
  name: string;
  quantity: number;
  checked: boolean;
};

const GroceryList = () => {
  const [listItems, setListItems] = useState<GroceryItem[]>([]);
  const [value, setValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [dragId, setDragId] = useState<string>('');
  const [dragOverId, setDragOverId] = useState<string>('');
  const [focus, setFocus] = useState<number>(0);
  const listRef = useRef<HTMLUListElement>(null);
  const suggRef = useRef<HTMLUListElement>(null);

  const listElements = listRef.current?.children as HTMLCollection;
  const suggElements = suggRef.current?.children as HTMLCollection;

  useEffect(() => {
    const debouncer: ReturnType<typeof setTimeout> = setTimeout(() => {
      if (value.trim() !== '') {
        fetchSuggestions(value);
      } else {
        setValue('');
        setSuggestions([]);
        setFocus(0);
      }
    }, 500);
    return () => {
      clearTimeout(debouncer);
    };
  }, [value]);

  useEffect(() => {
    if (suggElements === undefined) return;
    const suggElementsArray = Array.from(suggElements) as HTMLElement[];
    if (focus >= 0 && focus <= suggestions.length - 1) {
      suggElementsArray[focus].focus();
    } else {
      return;
    }
  }, [focus, suggestions, suggElements]);

  const getElementIndex = (id: string) => {
    return Array.from(listElements)
      .map((item, i) => (item.id === id ? i : 0))
      .reduce((acc, curr) => acc + curr);
  };

  const fetchSuggestions = async (query: string) => {
    try {
      const response = await fetch(`${API_URL}/${query}`);
      const data = await response.json();
      setSuggestions(data.map((item: string) => item));
    } catch (error) {
      console.error('Error fetching suggestions: ', error);
    }
  };

  const onSuggest = (ev: ChangeEvent<HTMLInputElement>) =>
    setValue(ev.target.value);

  const onSuggestionSelected = (suggestion: string) => {
    setListItems([
      ...listItems,
      { name: suggestion, quantity: 1, checked: false },
    ]);
    setValue('');
    setSuggestions([]);
  };

  const handleDragStart = (ev: DragEvent<HTMLLIElement>) =>
    setDragId(ev.currentTarget.id);

  const handleDragOver = (ev: DragEvent<HTMLLIElement>) =>
    setDragOverId(ev.currentTarget.id);

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
    copyListItems.map(
      (item, i) =>
        (item.quantity = i === index ? Number(ev.target.value) : item.quantity)
    );
    return setListItems(copyListItems);
  };

  const updateItemChecked = (index: number) => {
    const copyListItems = [...listItems];
    copyListItems.map(
      (item, i) => (item.checked = i === index ? !item.checked : item.checked)
    );
    return setListItems(copyListItems);
  };

  const handleKeyDown = (ev: KeyboardEvent, suggestion: string) => {
    switch (ev.key) {
      case 'ArrowUp':
        focus > 0 && focus <= suggestions.length - 1
          ? setFocus((prevState) => prevState - 1)
          : setFocus(0);
        break;
      case 'ArrowDown':
        focus >= 0 && focus <= suggestions.length - 1
          ? setFocus((prevState) => prevState + 1)
          : setFocus(0);
        break;
      case 'Enter':
        suggestion !== '' && onSuggestionSelected(suggestion);
        break;
      default:
        return;
    }
  };
  return (
    <div>
      <div className="grocery-list-container">
        <h1>Grocery List</h1>
        <ul ref={listRef} className="grocery-list">
          {listItems.map((item, index) => {
            return (
              <GroceryListItem
                id={`item-${index}`}
                key={`i${index}`}
                index={index}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDelete={handleDeleteItem}
                updateQuantity={updateItemQuantity}
                updateChecked={updateItemChecked}
                name={item.name}
                quantity={item.quantity}
                checked={item.checked}
              />
            );
          })}
        </ul>
      </div>
      <div className="user-selection">
        <input
          type="text"
          value={value}
          name="quantity"
          onChange={onSuggest}
          placeholder={`Type to find ${
            listItems.length > 0 ? 'more ' : ''
          }items...`}
        />
        <ul
          className={`suggestion-list ${value !== '' && 'open'}`}
          ref={suggRef}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => onSuggestionSelected(suggestion)}
              tabIndex={0}
              onKeyDown={(ev) => handleKeyDown(ev, suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GroceryList;
