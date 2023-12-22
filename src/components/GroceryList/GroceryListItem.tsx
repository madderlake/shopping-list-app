import { useState, useRef, MutableRefObject } from 'react';

export interface GroceryListItemProps {
  id: string;
  order: number;
  onDragStart: (ev: React.DragEvent<HTMLLIElement>) => void;
  onDragOver: (ev: React.DragEvent<HTMLLIElement>) => void;
  onDrop: (ev: React.DragEvent<HTMLLIElement>) => void;
  text: string;
  ref: MutableRefObject<null>;
}

const GroceryListItem = ({
  id,
  order,
  onDragOver,
  onDragStart,
  onDrop,
  text,
  ref,
}: GroceryListItemProps): JSX.Element => {
  return (
    <li
      id={id}
      draggable
      onDragOver={onDragOver}
      onDragStart={onDragStart}
      onDrop={onDrop}
      ref={ref}
      style={{
        border: '1px lightgrey solid',
        listStyleType: 'none',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '5px',
        color: 'black',
        height: '40px',
      }}>
      <span>{order + 1}&nbsp;</span>
      <span>{text}</span>
    </li>
  );
};

export default GroceryListItem;
