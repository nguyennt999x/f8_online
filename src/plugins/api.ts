import { AuthCredentials, CustomerInterface, ProductRequest } from '../interface';
import api from './axios';
import { login } from './axios';

export const signIn = (credentials: AuthCredentials) => {
    return login(credentials);
};

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
};

export const getProducts = () => {
    return api.get('/products');
};

export const getProductById = (id: number) => {
    return api.get(`/products/${id}`);
};

export const addProduct = (data: ProductRequest) => {
    return api.post('/products', data);
};

export const updateProduct = (id: number, data: ProductRequest) => {
    return api.put(`/products/${id}`, data);
};

export const deleteProduct = (id: number) => {
    return api.delete(`/products/${id}`);
};

