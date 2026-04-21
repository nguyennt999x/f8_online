import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { ProductResponse } from '../../interface';

interface ProductTableProps {
    products: ProductResponse[];
    loading: boolean;
    onEdit: (product: ProductResponse) => void;
    onDelete: (product: ProductResponse) => void;
}

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
});

const ProductTable = ({ products, loading, onEdit, onDelete }: ProductTableProps) => {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#eff6ff' }}>
                        <TableCell sx={{ fontWeight: 700 }}>Image</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>SKU</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Remaining</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                <CircularProgress />
                            </TableCell>
                        </TableRow>
                    ) : products.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                <Typography color="text.secondary">
                                    Chua co product nao. Hay them product dau tien.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        products.map((product) => (
                            <TableRow key={product.id} hover>
                                <TableCell>
                                    <Avatar
                                        src={product.imageUrl}
                                        alt={product.name}
                                        variant="rounded"
                                        sx={{ width: 56, height: 56 }}
                                    >
                                        {product.name?.charAt(0).toUpperCase()}
                                    </Avatar>
                                </TableCell>
                                <TableCell sx={{ minWidth: 180 }}>{product.name || '-'}</TableCell>
                                <TableCell>{product.sku || '-'}</TableCell>
                                <TableCell>{product.category?.name || '-'}</TableCell>
                                <TableCell>
                                    {typeof product.price === 'number'
                                        ? currencyFormatter.format(product.price)
                                        : '-'}
                                </TableCell>
                                <TableCell>{product.remaining ?? '-'}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => onEdit(product)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() => onDelete(product)}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProductTable;
