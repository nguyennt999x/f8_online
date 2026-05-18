import { KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CellInput from './CellInput';
import Row from './Row.tsx';
import {
  SpreadsheetContext,
  type CellPosition,
  type SpreadsheetColumn,
  type SpreadsheetRow,
} from './store';
import './EditableTable.css';

type EditableTableProps = {
  columns: SpreadsheetColumn[];
  rows: SpreadsheetRow[];
  onInput: (rowIndex: number, columnName: string, value: string) => void;
};

const hiddenCursor = {
  top: -1000,
  left: -1000,
  width: 0,
  height: 0,
  rowIndex: -1,
  columnIndex: -1,
  isEditing: false,
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const isTypingKey = (event: KeyboardEvent<HTMLDivElement>) =>
  event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;

const EditableTable = ({ columns, rows, onInput }: EditableTableProps) => {
  const shell = useRef<HTMLDivElement>(null);
  const table = useRef<HTMLTableElement>(null);
  const [cursor, setCursor] = useState(hiddenCursor);
  const [selectionStart, setSelectionStart] = useState<CellPosition | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<CellPosition | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const selectCell = useCallback(
    (position: CellPosition, appendRange = false) => {
      const cell = document.getElementById(`cell-${position.rowIndex}-${position.columnIndex}`);

      if (!cell) {
        return;
      }

      shell.current?.focus();

      setCursor({
        top: cell.offsetTop,
        left: cell.offsetLeft,
        width: cell.offsetWidth,
        height: cell.offsetHeight,
        rowIndex: position.rowIndex,
        columnIndex: position.columnIndex,
        isEditing: false,
      });

      if (!appendRange) {
        setSelectionStart(position);
      }

      setSelectionEnd(position);
    },
    [],
  );

  useEffect(() => {
    const stopDragging = () => setIsDragging(false);

    document.addEventListener('mouseup', stopDragging);

    return () => {
      document.removeEventListener('mouseup', stopDragging);
    };
  }, []);

  const startEditing = useCallback(
    (initialValue?: string) => {
      if (cursor.rowIndex < 0 || cursor.columnIndex < 0) {
        return;
      }

      const column = columns[cursor.columnIndex];
      const value = rows[cursor.rowIndex]?.[column.name];

      setEditingValue(initialValue ?? String(value ?? ''));
      setCursor((current) => ({ ...current, isEditing: true }));
    },
    [columns, cursor.columnIndex, cursor.rowIndex, rows],
  );

  const stopEditing = useCallback(() => {
    setCursor((current) => ({ ...current, isEditing: false }));
  }, []);

  const commitEditing = useCallback(
    (value: string) => {
      if (cursor.rowIndex < 0 || cursor.columnIndex < 0) {
        return;
      }

      onInput(cursor.rowIndex, columns[cursor.columnIndex].name, value);
      setCursor((current) => ({ ...current, isEditing: false }));
    },
    [columns, cursor.columnIndex, cursor.rowIndex, onInput],
  );

  const moveSelection = useCallback(
    (rowDelta: number, columnDelta: number) => {
      const nextRow = clamp(cursor.rowIndex + rowDelta, 0, rows.length - 1);
      const nextColumn = clamp(cursor.columnIndex + columnDelta, 0, columns.length - 1);

      selectCell({ rowIndex: nextRow, columnIndex: nextColumn });
    },
    [columns.length, cursor.columnIndex, cursor.rowIndex, rows.length, selectCell],
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (cursor.isEditing || cursor.rowIndex < 0 || cursor.columnIndex < 0) {
      return;
    }

    if (isTypingKey(event)) {
      event.preventDefault();
      startEditing(event.key);
      return;
    }

    switch (event.key) {
      case 'Enter':
      case 'F2':
        event.preventDefault();
        startEditing();
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveSelection(-1, 0);
        break;
      case 'ArrowDown':
        event.preventDefault();
        moveSelection(1, 0);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        moveSelection(0, -1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        moveSelection(0, 1);
        break;
      case 'Tab':
        event.preventDefault();
        moveSelection(0, event.shiftKey ? -1 : 1);
        break;
      default:
        break;
    }
  };

  const selectedRange = useMemo(() => {
    if (!selectionStart || !selectionEnd) {
      return null;
    }

    return {
      top: Math.min(selectionStart.rowIndex, selectionEnd.rowIndex),
      bottom: Math.max(selectionStart.rowIndex, selectionEnd.rowIndex),
      left: Math.min(selectionStart.columnIndex, selectionEnd.columnIndex),
      right: Math.max(selectionStart.columnIndex, selectionEnd.columnIndex),
    };
  }, [selectionEnd, selectionStart]);

  const provider = {
    columns,
    rows,
    cursor,
    selectCell,
    startEditing,
    table,
    selectedRange,
    isDragging,
    setIsDragging,
  };

  return (
    <SpreadsheetContext.Provider value={provider}>
      <div className="sheet-shell" onKeyDown={handleKeyDown} ref={shell} tabIndex={0}>
        <div className="sheet-scroller">
          <table className="editable-table" ref={table}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.name} style={{ width: column.width }}>
                    {column.label ?? column.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((_row, index) => (
                <Row key={index} rowIndex={index} />
              ))}
            </tbody>
          </table>
          <CellInput
            cursor={cursor}
            value={editingValue}
            onChange={setEditingValue}
            onCancel={stopEditing}
            onCommit={commitEditing}
            onMoveSelection={moveSelection}
          />
        </div>
      </div>
    </SpreadsheetContext.Provider>
  );
};

export default EditableTable;
