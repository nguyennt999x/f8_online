import { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    Chip,
    Container,
    Stack,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../components/ConfirmDialog';
import ProductForm from '../components/ProductForm';
import ProductTable from '../components/ProductTable';
import { CategoryResponse, ProductRequest, ProductResponse } from '../interface';
import {
    addProduct,
    deleteProduct,
    getProducts,
    updateProduct,
} from '../plugins/api';
import { clearAuthTokens } from '../plugins/axios';
import { getErrorMessage, unwrapApiData } from '../utils/api';

const ProductPage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [pageLoading, setPageLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [productToDelete, setProductToDelete] = useState<ProductResponse | null>(null);
    const [error, setError] = useState('');
    const categories = products.reduce<CategoryResponse[]>((result, product) => {
        if (!product.category) {
            return result;
        }

        const hasCategory = result.some((category) => category.id === product.category?.id);
        if (!hasCategory) {
            result.push(product.category);
        }

        return result;
    }, []);

    const fetchPageData = async () => {
        try {
            setPageLoading(true);
            setError('');

            const productsResponse = await getProducts();

            setProducts(unwrapApiData<ProductResponse[]>(productsResponse.data) || []);
        } catch (fetchError) {
            setError(getErrorMessage(fetchError, 'Khong tai duoc danh sach product.'));
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        fetchPageData();
    }, []);

    const handleClosePopup = () => {
        setOpenPopup(false);
        setEditingProduct(null);
    };

    const handleSubmit = async (data: ProductRequest) => {
        try {
            setSubmitLoading(true);
            setError('');

            const response = editingProduct
                ? await updateProduct(editingProduct.id, data)
                : await addProduct(data);
            const savedProduct = unwrapApiData<ProductResponse>(response.data);

            setProducts((prev) => {
                if (editingProduct) {
                    return prev.map((product) =>
                        product.id === editingProduct.id ? savedProduct : product
                    );
                }

                return [savedProduct, ...prev];
            });

            handleClosePopup();
        } catch (submitError) {
            setError(getErrorMessage(submitError, 'Khong luu duoc product.'));
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleRequestDelete = (product: ProductResponse) => {
        setProductToDelete(product);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) {
            return;
        }

        try {
            setSubmitLoading(true);
            setError('');
            await deleteProduct(productToDelete.id);
            setProducts((prev) => prev.filter((product) => product.id !== productToDelete.id));
            setOpenDeleteDialog(false);
            setProductToDelete(null);
        } catch (deleteError) {
            setError(getErrorMessage(deleteError, 'Khong xoa duoc product.'));
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleLogout = () => {
        clearAuthTokens();
        navigate('/login', { replace: true });
    };

    return (
        <Box sx={{ minHeight: '100vh', py: 4 }}>
            <Container maxWidth="lg">
                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        overflow: 'hidden',
                        border: '1px solid rgba(18, 48, 71, 0.08)',
                        boxShadow: '0 24px 60px rgba(15, 23, 42, 0.12)',
                    }}
                >
                    <Box
                        sx={{
                            px: { xs: 2.5, sm: 4 },
                            py: 3,
                            borderBottom: '1px solid rgba(18, 48, 71, 0.08)',
                            background:
                                'linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(59, 130, 246, 0.04))',
                        }}
                    >
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={2}
                            sx={{ justifyContent: 'space-between' }}
                        >
                            <Box>
                                <Typography variant="overline" sx={{ letterSpacing: '0.12em' }}>
                                    Product Manager
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                    Product page
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                                    <Chip label={`${products.length} products`} color="primary" />
                                    <Chip
                                        label={`${categories.length} categories`}
                                        variant="outlined"
                                    />
                                </Stack>
                            </Box>

                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={1.5}
                                sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}
                            >
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        setEditingProduct(null);
                                        setOpenPopup(true);
                                    }}
                                >
                                    Add product
                                </Button>
                                <Button variant="outlined" color="inherit" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>

                    <Box sx={{ p: { xs: 2, sm: 3 } }}>
                        {error ? (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        ) : null}

                        <ProductTable
                            products={products}
                            loading={pageLoading}
                            onEdit={(product) => {
                                setEditingProduct(product);
                                setOpenPopup(true);
                            }}
                            onDelete={handleRequestDelete}
                        />
                    </Box>
                </Card>
            </Container>

            <ProductForm
                open={openPopup}
                categories={categories}
                editingData={editingProduct}
                loading={submitLoading}
                onSubmit={handleSubmit}
                onClose={handleClosePopup}
            />

            <ConfirmDialog
                open={openDeleteDialog}
                title="Delete product"
                message={
                    productToDelete
                        ? `Ban co chac chan muon xoa "${productToDelete.name}" khong?`
                        : 'Ban co chac chan muon xoa product nay khong?'
                }
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setOpenDeleteDialog(false);
                    setProductToDelete(null);
                }}
                confirmText="Delete"
                loading={submitLoading}
            />
        </Box>
    );
};

export default ProductPage;
