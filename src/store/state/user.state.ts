import { IUser } from '../../interfaces/user.interface';
import { LocalStore } from '../../utils/storage.utils';

export const userState: IUser | null | undefined = LocalStore.get("USER_DATA") ;
