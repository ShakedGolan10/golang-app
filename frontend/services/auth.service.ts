import { User } from "@/store/reducers/user.reducer";
import { axiosService } from "./axios.service";

const isLoggedIn = async (): Promise<User> => {
    const user = await axiosService.get<User>('protected/auth');
    if (!user) throw new Error('Couldnt login');
    return user;
};

const login = async (creds: Creds): Promise<User> => {
    const user = await axiosService.post<User>('login', creds);
    if (!user) throw new Error('Couldnt login');
    return user;
};

const register = async (creds: RegisterCreds): Promise<User> => {
    const user = await axiosService.post<User>('register', creds);
    return user;
};

const logout = async (): Promise<void> => {
    try {
        await axiosService.post<User>('logout');
    } catch (error) {
        return undefined;
    }
};


export const authService = { register, login, isLoggedIn, logout }