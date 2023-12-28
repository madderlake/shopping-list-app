import { ChangeEvent, DragEvent } from 'react';

export interface ListItemProps {
  id: string;
  onDragStart: (ev: DragEvent<HTMLLIElement>) => void;
  onDragOver: (ev: DragEvent<HTMLLIElement>) => void;
  onDrop: (ev: DragEvent<HTMLLIElement>) => void;
  onDelete: (id: string) => void;
  updateQuantity: (index: number, ev: ChangeEvent<HTMLInputElement>) => void;
  updateChecked: (index: number) => void;
  name: string;
  index: number;
  quantity: string | number;
  checked: boolean;
}

const Hamburger = () => {
  return (
    <div className="hamburger">
      <div className="center"></div>
    </div>
  );
};

const GroceryListItem = ({
  onDragOver,
  onDragStart,
  onDrop,
  onDelete,
  updateQuantity,
  updateChecked,
  id,
  name,
  index,
  quantity,
  checked,
}: ListItemProps): JSX.Element => {
  return (
    <li
      key={index}
      className={`list-item ${checked && 'checked'}`}
      id={id}
      draggable
      onDragStart={(event) => onDragStart(event)}
      onDragEnter={(event) => onDragOver(event)}
      onDragEnd={onDrop}>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => updateChecked(index)}
      />
      <input
        id={`q${index + 1}`}
        name="quantity"
        type="number"
        value={quantity}
        disabled={checked === true}
        onChange={(ev) => updateQuantity(index, ev)}
      />{' '}
      {name}
      <Hamburger />
      <button
        aria-label={`remove ${name}`}
        className="remove-btn"
        onClick={() => onDelete(id)}>
        &#x2715;
      </button>
    </li>
  );
};

export default GroceryListItem;