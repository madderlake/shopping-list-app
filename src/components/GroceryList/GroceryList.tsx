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
  const [dragItemIndex, setDragItemIndex] = useState<number | undefined>();
  const [dragOverItemIndex, setDragOverItemIndex] = useState<
    number | undefined
  >();
  const [focus, setFocus] = useState<number>(0);
  const listRef = useRef<HTMLUListElement>(null);
  const suggRef = useRef<HTMLUListElement>(null);
  const suggElements = suggRef.current?.children as HTMLCollection;
  const listItemsClone = [...listItems];

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

  const sortListItems = (arr: GroceryItem[]) =>
    arr.sort((a, b) => (a.checked === b.checked ? 0 : b.checked ? -1 : 1));

  useEffect(() => {
    const sortTransition = setTimeout(() => {
      sortListItems(listItems);
    }, 200);
    return () => clearTimeout(sortTransition);
  }, [listItems]);

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

  const suggestionSelected = (suggestion: string) => {
    setListItems([
      ...listItems,
      { name: suggestion, quantity: 1, checked: false },
    ]);
    setValue('');
    setSuggestions([]);
  };

  const handleDragStart = (index: number) => setDragItemIndex(index);

  const handleDragOver = (ev: DragEvent<HTMLLIElement>, index: number) => {
    ev.preventDefault();
    setDragOverItemIndex(index);
  };

  const handleDrop = () => {
    if (dragItemIndex === undefined || dragOverItemIndex === undefined) return;
    const dragItemContent = listItemsClone[dragItemIndex];

    listItemsClone.splice(dragItemIndex, 1);
    listItemsClone.splice(dragOverItemIndex, 0, dragItemContent);
    setListItems(listItemsClone);
  };

  const handleDeleteItem = (index: number) => {
    listItemsClone.splice(index, 1);
    setListItems(listItemsClone);
  };

  const updateItemQuantity = (
    index: number,
    ev: ChangeEvent<HTMLInputElement>
  ) => {
    listItemsClone[index].quantity = Number(ev.currentTarget.value);
    setListItems(listItemsClone);
  };

  const updateItemChecked = (index: number) => {
    listItemsClone[index].checked = !listItemsClone[index].checked;
    sortListItems(listItemsClone);
    setListItems(listItemsClone);
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
        suggestionSelected(suggestion);
        break;
      default:
        return;
    }
  };
  return (
    <div className="grocery-list-container">
      <h1>Grocery List</h1>
      <div className="column-container">
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
            className={`suggestion-list ${value !== '' ? 'open' : ''}`}
            ref={suggRef}>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => suggestionSelected(suggestion)}
                tabIndex={0}
                onKeyDown={(ev) => handleKeyDown(ev, suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
        {listItems.length > 0 ? (
          <ul ref={listRef} className="grocery-list">
            {listItems.map((item, index) => {
              return (
                <GroceryListItem
                  key={`i${index}`}
                  index={index}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(ev) => handleDragOver(ev, index)}
                  onDrop={handleDrop}
                  onDelete={() => handleDeleteItem(index)}
                  updateQuantity={updateItemQuantity}
                  updateChecked={updateItemChecked}
                  name={item.name}
                  quantity={item.quantity}
                  checked={item.checked}
                />
              );
            })}
          </ul>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default GroceryList;
