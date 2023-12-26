import { ChangeEvent } from 'react';

export interface ListItemProps {
  id: string;
  onDragStart: (ev: React.DragEvent<HTMLLIElement>) => void;
  onDragOver: (ev: React.DragEvent<HTMLLIElement>) => void;
  onDrop: (ev: React.DragEvent<HTMLLIElement>) => void;
  onDelete: (id: string) => void;
  updateQuantity: (index: number, ev: ChangeEvent<HTMLInputElement>) => void;
  text: string;
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

const ListItem = ({
  onDragOver,
  onDragStart,
  onDrop,
  onDelete,
  updateQuantity,
  id,
  text,
  index,
  quantity,
  checked = false,
}: ListItemProps): JSX.Element => {
  return (
    <li
      key={index}
      className="list-item"
      id={id}
      draggable
      onDragStart={(event) => onDragStart(event)}
      onDragEnter={(event) => onDragOver(event)}
      onDragEnd={onDrop}>
      <input
        className="quantity"
        id={`q${index + 1}`}
        name="quantity"
        type="number"
        // defaultValue="1"
        value={quantity}
        checked={checked}
        onChange={(ev) => updateQuantity(index, ev)}
      />{' '}
      {text}
      <Hamburger />
      <span
        aria-label={`remove ${text}`}
        className="remove-btn"
        onClick={() => onDelete(id)}>
        &#x2715;
      </span>
    </li>
  );
};

export default ListItem;
