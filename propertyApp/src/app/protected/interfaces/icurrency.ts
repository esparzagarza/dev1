export interface ICurrency {
    id: string;
    accountid: string;
    name: string;
    amount: number;
    symbol: string;
    currency_precision: string;
    thousand_separator: string;
    decimal_separator: string;
    currency_code: string;
    status: string;
    created_by?: string;
    created_at?: string;
    modified_by?: string;
    modified_at?: string;
}
