import { IApiInterface } from './api.interface';

export interface ICompany extends IApiInterface {
  name: string;

  country: string;

  language: string;

  contact: string;

  legal_status: string;

  address: string;

  admin_email: string;

  capital: string;

  number_of_employees: number;

  function: string;

  category: string;

  domains: string[];

  owner_id: string;

  certification: string;
}

export type ICreateCompany = Omit<ICompany, 'owner_id' | 'id' | 'created_at' | 'updated_at' | 'deleted'>;
