import { useContext } from 'react';
import Cell from './Cell';
import { SpreadsheetContext } from './store';

type RowProps = {
  rowIndex: number;
};

const Row = ({ rowIndex }: RowProps) => {
  const context = useContext(SpreadsheetContext);

  if (!context) {
    return null;
  }

  return (
    <tr>
      {context.columns.map((column, columnIndex) => (
        <Cell key={column.name} rowIndex={rowIndex} columnIndex={columnIndex} />
      ))}
    </tr>
  );
};

export default Row;
