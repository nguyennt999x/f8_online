import { useState, useEffect } from 'react';
import { CircularProgress, Button } from '@mui/material';
import PopupForm from './components/PopupForm';
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from './plugins/api';
import { CustomerResponse, CustomerInterface } from './interface';

interface ColumnInterface {
    value: string;
    text: string;
}

const Table = () => {
    const [customers, setCustomers] = useState<CustomerResponse[]>([]);
    const [openPopup, setOpenPopup] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [editingCustomer, setEditingCustomer] = useState<CustomerResponse | null>(null);

    const columns: ColumnInterface[] = [
    {
        value: "name",
        text: "Name"
    }, {
        value: "email",
        text: "Email"
    }, {
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

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            deleteCustomer(id)
                .then(() => {
                    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
                })
                .catch((error) => {
                    console.error('Failed to delete customer:', error);
                });
        }
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
            if (editingCustomer) {
                await updateCustomer(editingCustomer.id, data);
            } else {
                await addCustomer(data);
            }
            setOpenPopup(false);
            setEditingCustomer(null);
            await fetchCustomers();
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
            <div style={{display: 'flex'}}>
                <table width='100%' cellPadding={0}  cellSpacing={0} border={1}>
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th key={column.value} >{column.text}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '40px' }}>
                                    <CircularProgress />
                                </td>
                            </tr>
                        ) : customers.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '20px' }}>
                                    No data
                                </td>
                            </tr>
                        ) : (
                            customers.map((customer: CustomerResponse) => (
                                <tr key={customer.id}>
                                    {columns.map((column) => {
                                        if (column.value === "action") {
                                            return (
                                                <td
                                                    key={column.value} 
                                                    style={{
                                                        display: 'flex',
                                                        gap: '8px',
                                                    }}
                                                >
                                                    <Button variant='contained' onClick={() => {
                                                        setEditingCustomer(customer);
                                                        setOpenPopup(true);
                                                    }}>Edit</Button>
                                                    <Button variant='contained'onClick={() => handleDelete(customer.id)}>Delete</Button>
                                                </td>
                                            );
                                        }
                                        return <td key={column.value} >{customer[column.value]}</td>;
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <button onClick={() => setOpenPopup(true)}>Add Customer</button>
            </div>
            <PopupForm 
                open={openPopup} 
                editingData={editingCustomer}
                onSubmit={handleSubmit}
                loading={loading}
                onClose={() => setOpenPopup(false)} 
            />
        </>
    )
}

export default Table;
