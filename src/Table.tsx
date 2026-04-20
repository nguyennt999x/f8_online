import { useState, useEffect } from 'react';
import { Button, Box } from '@mui/material';
import CustomerTable from './components/CustomerTable';
import PopupForm from './components/PopupForm';
import ConfirmDialog from './components/ConfirmDialog';
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from './plugins/api';
import { CustomerResponse, CustomerInterface } from './interface';

const Table = () => {
    const [customers, setCustomers] = useState<CustomerResponse[]>([]);
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [editingCustomer, setEditingCustomer] = useState<CustomerResponse | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [customerToDelete, setCustomerToDelete] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        setCustomerToDelete(id);
        setOpenDeleteDialog(true);
    }

    const handleConfirmDelete = () => {
        if (customerToDelete !== null) {
            deleteCustomer(customerToDelete)
                .then(() => {
                    setCustomers((prev) => prev.filter((customer) => customer.id !== customerToDelete));
                })
                .catch((error) => {
                    console.error('Failed to delete customer:', error);
                })
                .finally(() => {
                    setOpenDeleteDialog(false);
                    setCustomerToDelete(null);
                });
        }
    }

    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
        setCustomerToDelete(null);
    }

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const { data } = await getCustomers();
            setCustomers(data || []);
        } catch (error) {
            console.error('Failed to fetch customers:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (data: CustomerInterface) => {
        try {
            setLoading(true);
            let response;
            
            if (editingCustomer) {
                response = await updateCustomer(editingCustomer.id, data);
                // Update existing customer in state with response data
                const updatedCustomer = response.data?.data || response.data;
                setCustomers((prev) =>
                    prev.map((customer) =>
                        customer.id === editingCustomer.id
                            ? { ...customer, ...updatedCustomer }
                            : customer
                    )
                );
            } else {
                response = await addCustomer(data);
                // Add new customer to state with response data
                const newCustomer = response.data?.data || response.data;
                setCustomers((prev) => [...prev, newCustomer]);
            }
            
            setOpenPopup(false);
            setEditingCustomer(null);
        } catch (error) {
            console.error('Failed to submit customer:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <>
            <Box sx={{ marginBottom: '20px' }}>
                <Button 
                    variant='contained' 
                    onClick={() => {
                        setEditingCustomer(null);
                        setOpenPopup(true);
                    }}
                >
                    Add Customer
                </Button>
            </Box>
            <CustomerTable 
                customers={customers}
                loading={loading}
                onEdit={(customer) => {
                    setEditingCustomer(customer);
                    setOpenPopup(true);
                }}
                onDelete={handleDelete}
            />
            <PopupForm 
                open={openPopup} 
                editingData={editingCustomer}
                onSubmit={handleSubmit}
                loading={loading}
                onClose={() => setOpenPopup(false)} 
            />
            <ConfirmDialog
                open={openDeleteDialog}
                title="Confirm Delete"
                message="Are you sure you want to delete this customer?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                loading={loading}
            />
        </>
    )
}

export default Table;
