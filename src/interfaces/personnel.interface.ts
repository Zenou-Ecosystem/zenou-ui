import { IApiInterface } from './api.interface';

export interface IPersonnel extends IApiInterface  {
  username: string;
  email: string;
  role: string;
  address: string;
  domains: string[];
}
