export interface IAccount {
    id: string;
    email: string;
    name: string;
    appname: string;
    description: string;
    slug: string;
    image: string;
    type: string;
    status: string;
    modified_by?: string;
    modified_at?: string;
}
