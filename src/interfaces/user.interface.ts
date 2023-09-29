import { IApiInterface } from './api.interface';

export interface IUser extends IApiInterface  {
  username: string;
  email: string;
  password?: string;
  role: string;
  sector: string[];
  access_token: string;
  permissions: string[];
  address: string
  company_id: string;
}
