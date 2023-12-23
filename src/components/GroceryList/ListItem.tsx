import { ChangeEvent, useState } from 'react';

export interface ListItemProps {
  id: string;
  onDragStart: (ev: React.DragEvent<HTMLLIElement>) => void;
  onDragOver: (ev: React.DragEvent<HTMLLIElement>) => void;
  onDrop: (ev: React.DragEvent<HTMLLIElement>) => void;
  onDelete: (id: string) => void;
  text: string;
  index: number;
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
  id,
  text,
  index,
}: ListItemProps): JSX.Element => {
  const [quantity, setQuantity] = useState<number | string>(1);

  const updateQuantity = (ev: ChangeEvent) => {
    const target = ev.target as HTMLInputElement;
    setQuantity(target.value);
  };
  return (
    <li
      key={index}
      className="list-item"
      id={id}
      draggable
      onDragStart={(event) => onDragStart(event)}
      onDragEnter={(event) => onDragOver(event)}
      onDragEnd={onDrop}>
      {/*{`${index + 1}.  ${item}`}*/}
      <input
        className="quantity"
        id={`q${index + 1}`}
        name="quantity"
        type="number"
        // defaultValue="1"
        value={quantity}
        onChange={(e) => updateQuantity(e)}
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
