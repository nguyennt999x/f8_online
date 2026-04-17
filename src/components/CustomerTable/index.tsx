import { 
    Table, 
    TableHead, 
    TableBody, 
    TableRow, 
    TableCell, 
    Button, 
    CircularProgress, 
    Box 
} from '@mui/material';
import { CustomerResponse } from '../../interface';

interface ColumnInterface {
    value: string;
    text: string;
}

interface CustomerTableProps {
    customers: CustomerResponse[];
    loading: boolean;
    onEdit: (customer: CustomerResponse) => void;
    onDelete: (id: number) => void;
}

const columns: ColumnInterface[] = [
    {
        value: "name",
        text: "Name"
    },
    {
        value: "email",
        text: "Email"
    },
    {
        value: "phone",
        text: "Phone"
    },
    {
        value: "address",
        text: "Address"
    },
    {
        value: "rank",
        text: "Rank"
    },
    {
        value: "action",
        text: "Action"
    }
];

const CustomerTable = ({ customers, loading, onEdit, onDelete }: CustomerTableProps) => {
    return (
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        {columns.map((column) => (
                            <TableCell key={column.value} sx={{ fontWeight: 'bold' }}>
                                {column.text}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} align="center" sx={{ padding: '40px' }}>
                                <CircularProgress />
                            </TableCell>
                        </TableRow>
                    ) : customers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} align="center" sx={{ padding: '20px' }}>
                                No data
                            </TableCell>
                        </TableRow>
                    ) : (
                        customers.map((customer: CustomerResponse) => (
                            <TableRow key={customer.id} hover>
                                {columns.map((column) => {
                                    if (column.value === "action") {
                                        return (
                                            <TableCell key={column.value}>
                                                <Box sx={{ display: 'flex', gap: '8px' }}>
                                                    <Button 
                                                        variant='contained' 
                                                        size="small"
                                                        onClick={() => onEdit(customer)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button 
                                                        variant='contained' 
                                                        color="error"
                                                        size="small"
                                                        onClick={() => onDelete(customer.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                        );
                                    }
                                    return (
                                        <TableCell key={column.value}>
                                            {customer[column.value]}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </Box>
    );
};

export default CustomerTable;
