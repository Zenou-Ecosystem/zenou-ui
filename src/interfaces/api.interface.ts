export interface IApiInterface {
  id: string;
  created_at: string | number | Date;
  updated_at: string | number | Date;
  deleted?: string | boolean;
}
