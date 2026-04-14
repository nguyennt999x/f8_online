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
    rank: CustomerRank;
    [key: string]: string | number;
}

export interface CustomerResponse extends CustomerInterface {
    id: number;
    totalSpending: string;
}