import { createContext, Dispatch, RefObject, SetStateAction } from 'react';

export type SpreadsheetRow = Record<string, string | number | null | undefined>;

export type SpreadsheetColumn = {
  name: string;
  label?: string;
  width?: number | string;
};

export type CellPosition = {
  rowIndex: number;
  columnIndex: number;
};

export type CursorState = CellPosition & {
  top: number;
  left: number;
  width: number;
  height: number;
  isEditing: boolean;
};

export type SelectedRange = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

type SpreadsheetContextValue = {
  columns: SpreadsheetColumn[];
  rows: SpreadsheetRow[];
  cursor: CursorState;
  selectedRange: SelectedRange | null;
  isDragging: boolean;
  table: RefObject<HTMLTableElement>;
  selectCell: (position: CellPosition, appendRange?: boolean) => void;
  startEditing: (initialValue?: string) => void;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
};

export const SpreadsheetContext = createContext<SpreadsheetContextValue | null>(null);
