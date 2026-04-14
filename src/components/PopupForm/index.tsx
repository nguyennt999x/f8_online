import { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogTitle, TextField } from "@mui/material";
import { CustomerInterface } from "../../interface";

interface PopupFormInterface {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CustomerInterface) => void;
    loading?: boolean;
    editingData?: CustomerInterface | null;
}

const PopupForm = ({ open, onClose, onSubmit, loading = false, editingData }: PopupFormInterface) => {
    const [formData, setFormData] = useState<CustomerInterface>({
        name: '',
        email: '',
        phone: '',
        address: '',
        rank: '',
    });

    const isEditing = !!editingData;

    useEffect(() => {
        if (editingData) {
            setFormData({
                name: editingData.name || '',
                email: editingData.email || '',
                phone: editingData.phone || '',
                address: editingData.address || '',
                rank: editingData.rank || '',
            });
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                address: '',
                rank: '',
            });
        }
    }, [editingData, open]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target as HTMLInputElement;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data: CustomerInterface = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            rank: formData.rank,
        };
        onSubmit(data);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{isEditing ? 'EDIT CUSTOMER' : 'ADD CUSTOMER'}</DialogTitle>
            <form id="subscription-form" onSubmit={handleSubmit}>
                <TextField 
                    required 
                    label="Name" 
                    variant="outlined" 
                    fullWidth 
                    margin="dense" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                />
                <TextField 
                    required 
                    label="Email" 
                    variant="outlined" 
                    fullWidth 
                    margin="dense" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                />
                <TextField 
                    required 
                    label="Phone" 
                    variant="outlined" 
                    fullWidth 
                    margin="dense" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                />
                <TextField 
                    required 
                    label="Address" 
                    variant="outlined" 
                    fullWidth 
                    margin="dense" 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                />
                <TextField 
                    required 
                    label="Rank" 
                    fullWidth 
                    margin="dense"
                    name="rank"
                    select           
                    value={formData.rank}
                    onChange={handleInputChange}
                    slotProps={{
                        select: {
                            native: true,
                        },
                    }}
                >
                    <option value="">Select Rank</option>
                    <option value="GOLD">GOLD</option>
                    <option value="SILVER">SILVER</option>
                    <option value="BRONZE">BRONZE</option>
                </TextField>
            </form>
            <DialogActions>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button type="submit" form="subscription-form" disabled={loading}>
                    {loading ? 'Loading...' : 'Submit'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default PopupForm;