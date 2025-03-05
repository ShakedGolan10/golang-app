import { User } from '@/store/reducers/user.reducer';
import { axiosService } from './axios.service';

const getAll = async (): Promise<User[]> => {
  const user = await axiosService.get<User[]>('protected/users');
  return user;
};

const remove = async (id: string): Promise<void> => {
  await axiosService.delete<User>(`protected/users/${id}`);
};

export const userService = { remove, getAll }