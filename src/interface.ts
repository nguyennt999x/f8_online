export enum CustomerRank {
    GOLD = 'GOLD',
    SILVER = 'SILVER',
    BRONZE = 'BRONZE',
}

export interface CustomerInterface {
    name: string;
    email: string;
    phone: string;
    address: string;
    rank: CustomerRank | '';
    [key: string]: string | number;
}

export interface CustomerResponse extends CustomerInterface {
    id: number;
    totalSpending: string;
}

export interface AuthCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

export interface ProductRequest {
    categoryId: number;
    imageId?: string;
    name: string;
    sku?: string;
    price?: number;
    remaining?: number;
}

export interface CategoryResponse {
    id: number;
    name: string;
}

export interface ProductResponse {
    id: number;
    category?: CategoryResponse;
    imageUrl?: string;
    name: string;
    sku?: string;
    price?: number;
    remaining?: number;
}
