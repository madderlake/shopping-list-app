import { ChangeEvent, DragEvent } from 'react';

export interface ListItemProps {
  onDragStart: (index: number) => void;
  onDragOver: (ev: DragEvent<HTMLLIElement>) => void;
  onDrop: () => void;
  onDelete: (index: number) => void;
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
  name,
  index,
  quantity,
  checked,
}: ListItemProps): JSX.Element => {
  return (
    <li
      key={index}
      className={`list-item${checked ? ' checked' : ''}`}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(ev) => onDragOver(ev)}
      onDrop={onDrop}>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => updateChecked(index)}
      />
      <input
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
        className="delete-btn"
        onClick={() => onDelete(index)}>
        &#x2715;
      </button>
    </li>
  );
};

export default GroceryListItem;
