import { IApiInterface } from './api.interface';

export interface IUser extends IApiInterface  {
  username: string;
  email: string;
  password: string;
  role: string;
  domains: string[];
}
