import { useState } from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import EditableTable from '../components/EditableTable';
import type { SpreadsheetColumn, SpreadsheetRow } from '../components/store';

const columns: SpreadsheetColumn[] = [
  { name: 'task', label: 'Task', width: 240 },
  { name: 'owner', label: 'Owner', width: 160 },
  { name: 'status', label: 'Status', width: 150 },
  { name: 'priority', label: 'Priority', width: 140 },
  { name: 'deadline', label: 'Deadline', width: 160 },
  { name: 'note', label: 'Note', width: 260 },
];

const initialRows: SpreadsheetRow[] = [
  {
    task: 'Wireframe checkout flow',
    owner: 'Linh',
    status: 'In progress',
    priority: 'High',
    deadline: '2026-05-22',
    note: 'Review mobile states',
  },
  {
    task: 'Sync inventory API',
    owner: 'Nam',
    status: 'Todo',
    priority: 'Medium',
    deadline: '2026-05-24',
    note: 'Need staging token',
  },
  {
    task: 'Customer export',
    owner: 'Huyen',
    status: 'Done',
    priority: 'Low',
    deadline: '2026-05-18',
    note: 'CSV verified',
  },
  {
    task: 'Order dashboard QA',
    owner: 'Minh',
    status: 'In review',
    priority: 'High',
    deadline: '2026-05-21',
    note: 'Check filters',
  },
  {
    task: 'Product image cleanup',
    owner: 'An',
    status: 'Todo',
    priority: 'Low',
    deadline: '2026-05-27',
    note: '',
  },
];

const GoogleSheetPage = () => {
  const [rows, setRows] = useState(initialRows);

  const handleInput = (rowIndex: number, columnName: string, value: string) => {
    setRows((currentRows) =>
      currentRows.map((row, index) => (index === rowIndex ? { ...row, [columnName]: value } : row)),
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', background: '#eef2f7', py: 4 }}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between' }}
          >
            <Box>
              <Typography variant="h4" sx={{ color: '#111827', fontWeight: 800 }}>
                Google Sheet
              </Typography>
              <Typography sx={{ color: '#667085', mt: 0.5 }}>
                Bang du lieu mau cho workflow spreadsheet.
              </Typography>
            </Box>
            <Button component={RouterLink} to="/" variant="outlined">
              Back home
            </Button>
          </Stack>

          <EditableTable columns={columns} rows={rows} onInput={handleInput} />
        </Stack>
      </Container>
    </Box>
  );
};

export default GoogleSheetPage;
