export interface AuthRepsonse {
  status: number;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    id: string;
    accountid: string;
    email: string;
    image: string;
    name: string;
    role: string;
  }
}

export interface User {
  access_token: string;
  id: string;
  accountid: string;
  email: string;
  image: string;
  name: string;
  role: string;
}
