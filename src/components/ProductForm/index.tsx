import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import { CategoryResponse, ProductRequest, ProductResponse } from '../../interface';

interface ProductFormProps {
    open: boolean;
    categories: CategoryResponse[];
    loading?: boolean;
    editingData?: ProductResponse | null;
    onClose: () => void;
    onSubmit: (data: ProductRequest) => void;
}

interface ProductFormState {
    categoryId: string;
    imageId: string;
    name: string;
    sku: string;
    price: string;
    remaining: string;
}

const emptyFormState: ProductFormState = {
    categoryId: '',
    imageId: '',
    name: '',
    sku: '',
    price: '',
    remaining: '',
};

const ProductForm = ({
    open,
    categories,
    loading = false,
    editingData,
    onClose,
    onSubmit,
}: ProductFormProps) => {
    const [formData, setFormData] = useState<ProductFormState>(emptyFormState);
    const selectedCategory =
        categories.find((category) => String(category.id) === formData.categoryId) || null;
    const isSubmitDisabled = loading || !formData.name.trim() || !formData.categoryId;

    useEffect(() => {
        if (editingData) {
            setFormData({
                categoryId: editingData.category?.id ? String(editingData.category.id) : '',
                imageId: '',
                name: editingData.name || '',
                sku: editingData.sku || '',
                price: typeof editingData.price === 'number' ? String(editingData.price) : '',
                remaining:
                    typeof editingData.remaining === 'number' ? String(editingData.remaining) : '',
            });

            return;
        }

        setFormData(emptyFormState);
    }, [editingData, open]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload: ProductRequest = {
            categoryId: Number(formData.categoryId),
            name: formData.name.trim(),
            ...(formData.imageId.trim() ? { imageId: formData.imageId.trim() } : {}),
            ...(formData.sku.trim() ? { sku: formData.sku.trim() } : {}),
            ...(formData.price !== '' ? { price: Number(formData.price) } : {}),
            ...(formData.remaining !== '' ? { remaining: Number(formData.remaining) } : {}),
        };

        onSubmit(payload);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{editingData ? 'Edit Product' : 'Add Product'}</DialogTitle>
            <form id="product-form" onSubmit={handleSubmit}>
                <DialogContent sx={{ display: 'grid', gap: 2, pt: 1 }}>
                    <TextField
                        required
                        label="Product name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <Autocomplete
                        options={categories}
                        value={selectedCategory}
                        onChange={(_, value) => {
                            setFormData((prev) => ({
                                ...prev,
                                categoryId: value ? String(value.id) : '',
                            }));
                        }}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        noOptionsText="Khong co category"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                required
                                label="Category"
                                helperText={
                                    categories.length === 0
                                        ? 'Chua co category trong danh sach product.'
                                        : 'Chon category cho product.'
                                }
                            />
                        )}
                    />
                    <TextField
                        label="SKU"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        label="Image ID"
                        name="imageId"
                        value={formData.imageId}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        label="Price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        label="Remaining"
                        name="remaining"
                        type="number"
                        value={formData.remaining}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </DialogContent>
            </form>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    form="product-form"
                    variant="contained"
                    disabled={isSubmitDisabled}
                >
                    {loading ? 'Saving...' : editingData ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductForm;
