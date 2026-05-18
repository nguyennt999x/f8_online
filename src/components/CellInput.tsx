import { KeyboardEvent, useEffect, useRef } from 'react';

type CursorState = {
  top: number;
  left: number;
  width: number;
  height: number;
  rowIndex: number;
  columnIndex: number;
  isEditing: boolean;
};

type CellInputProps = {
  cursor: CursorState;
  value: string;
  onChange: (value: string) => void;
  onCancel: () => void;
  onCommit: (value: string) => void;
  onMoveSelection: (rowDelta: number, columnDelta: number) => void;
};

const CellInput = ({
  cursor,
  value,
  onChange,
  onCancel,
  onCommit,
  onMoveSelection,
}: CellInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cursor.isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [cursor.isEditing]);

  if (!cursor.isEditing) {
    return null;
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();

    if (event.key === 'Enter') {
      event.preventDefault();
      onCommit(value);
      onMoveSelection(event.shiftKey ? -1 : 1, 0);
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      onCancel();
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      onCommit(value);
      onMoveSelection(0, event.shiftKey ? -1 : 1);
    }
  };

  return (
    <input
      ref={inputRef}
      className="cell-input"
      style={{
        top: cursor.top,
        left: cursor.left,
        width: cursor.width,
        height: cursor.height,
      }}
      value={value}
      onBlur={() => onCommit(value)}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
};

export default CellInput;
