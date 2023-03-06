export interface IStaff {
  id: string;
  accountid: string;
  name: string;
  api_key: string;
  email: string;
  password: string;
  role: string;
  lastlogin: string;
  image: string;
  status: string;
  created_by?: string;
  created_at?: string;
  modified_by?: string;
  modified_at?: string;
}
