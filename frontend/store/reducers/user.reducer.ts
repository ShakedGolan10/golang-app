'use client'

import { authService } from "@/services/auth.service";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

export type User = {
  name: string
  email: string
  id: string
}

interface IUserState {
  user: User;
  authChecked: boolean;
  error?: string;
}

const initialState: IUserState = {
  user: {
    id: '',
    name: '',
    email: '',
  },
  authChecked: false,
  error: undefined
}

export const checkAuth = createAsyncThunk('user/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const user = await authService.isLoggedIn();
    return user;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const login = createAsyncThunk('user/login', async (creds: Creds, { rejectWithValue }) => {
  try {
    const user = await authService.login(creds);
    return user;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const logout = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
  try {
    const user = await authService.logout();
    return user;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const register = createAsyncThunk('user/register', async (registedCreds: RegisterCreds, { rejectWithValue }) => {
  try {
    const user = await authService.register(registedCreds);
    return user;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});


export const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ user: User }>) {
      return state = {
        user: {
          id: action.payload.user.id,
          name: action.payload.user.name,
          email: action.payload.user.email
        }
      }
    },
    clearUser(state) {
      return state = {
        user: {
          id: '',
          name: '',
          email: ''
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      if (action.payload && action.payload.id) {
        state.user.id = action.payload.id;
        state.user.name = action.payload.name;
        state.user.email = action.payload.email;
      } else {
        state.user.id = '';
        state.user.name = '';
        state.user.email = '';
      }
      state.authChecked = true;
    }),
      builder.addCase(checkAuth.rejected, (state, action) => {
        state.user.id = '';
        state.user.name = '';
        state.user.email = '';
        state.authChecked = true;
        state.error = action.payload as string;
      });
    builder.addCase(login.fulfilled, (state, action) => {
      if (action.payload && action.payload.id) {
        state.user.id = action.payload.id;
        state.user.name = action.payload.name;
        state.user.email = action.payload.email;
      } else {
        state.user.id = '';
        state.user.name = '';
        state.user.email = '';
      }
      state.authChecked = true;
    }),
      builder.addCase(login.rejected, (state, action) => {
        state.user.id = '';
        state.user.name = '';
        state.user.email = '';
        state.authChecked = true;
        state.error = action.payload as string;
        throw new Error(action.payload)
      });
    builder.addCase(logout.fulfilled, (state) => {
      state.user.id = '';
      state.user.name = '';
      state.user.email = '';
      state.authChecked = true;
    }),
      builder.addCase(logout.rejected, (state, action) => {
        state.user.id = '';
        state.user.name = '';
        state.user.email = '';
        state.authChecked = true;

      });
    builder.addCase(register.fulfilled, (state, action) => {
      if (action.payload && action.payload.id) {
        state.user.id = action.payload.id;
        state.user.name = action.payload.name;
        state.user.email = action.payload.email;
      } else {
        state.user.id = '';
        state.user.name = '';
        state.user.email = '';
      }
      state.authChecked = true;
    }),
      builder.addCase(register.rejected, (state, action) => {
        state.user.id = '';
        state.user.name = '';
        state.user.email = '';
        state.authChecked = true;
        state.error = action.payload as string;
        throw new Error(action.payload)
      });
  },
})

export const { setUser } = user.actions
export default user.reducer