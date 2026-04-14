import { CustomerInterface } from '../interface';
import api from './axios';

export const addCustomer = (data: CustomerInterface) => {
    return api.post('/customers', data);
};

export const getCustomers = () => {
    return api.get('/customers');
}

export const updateCustomer = (id: number, data: CustomerInterface) => {
    return api.put(`/customers/${id}`, data);
};

export const deleteCustomer = (id: number) => {
    return api.delete(`/customers/${id}`);
}