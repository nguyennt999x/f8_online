import { MouseEvent, useContext } from 'react';
import { SpreadsheetContext } from './store';

type CellProps = {
  rowIndex: number;
  columnIndex: number;
};

const Cell = ({ rowIndex, columnIndex }: CellProps) => {
  const context = useContext(SpreadsheetContext);

  if (!context) {
    return null;
  }

  const { columns, rows, cursor, selectedRange, isDragging, selectCell, setIsDragging, startEditing } =
    context;
  const column = columns[columnIndex];
  const value = rows[rowIndex]?.[column.name] ?? '';
  const isActive = cursor.rowIndex === rowIndex && cursor.columnIndex === columnIndex;
  const isSelected =
    selectedRange !== null &&
    rowIndex >= selectedRange.top &&
    rowIndex <= selectedRange.bottom &&
    columnIndex >= selectedRange.left &&
    columnIndex <= selectedRange.right;

  const position = { rowIndex, columnIndex };

  const handleMouseDown = (event: MouseEvent<HTMLTableCellElement>) => {
    event.preventDefault();
    selectCell(position);
    setIsDragging(true);
  };

  const handleMouseEnter = () => {
    if (isDragging) {
      selectCell(position, true);
    }
  };

  const handleDoubleClick = () => {
    selectCell(position);
    startEditing();
  };

  return (
    <td
      className={`${isSelected ? 'is-selected' : ''} ${isActive ? 'is-active' : ''}`}
      id={`cell-${rowIndex}-${columnIndex}`}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
    >
      {value}
    </td>
  );
};

export default Cell;
