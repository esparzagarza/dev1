export interface ITax {
    id: string;
    accountid: string;
    name: string;
    amount: number;
    status: string;
    created_by?: string;
    created_at?: string;
    modified_by?: string;
    modified_at?: string;
}
