import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/API';

export const login = createAsyncThunk(
    'user/login',
    async ({ username, password, rememberMe }, { rejectWithValue }) => {
        try {
            const data = await API.login(username, password);
            // data might be the token string directly
            return { token: typeof data === 'string' ? data : data.token };
        } catch (error) {
            return rejectWithValue('Login failed');
        }
    }
);

export const register = createAsyncThunk(
    'user/register',
    async ({ username, email, password }, { rejectWithValue }) => {
        try {
            const data = await API.register(username, email, password);
            return { token: typeof data === 'string' ? data : data.token };
        } catch (error) {
            return rejectWithValue('Registration failed');
        }
    }
);

export const logout = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        try {
            await API.logout();
            API.clearToken();
            return;
        } catch (error) {
            return rejectWithValue('Logout failed');
        }
    }
);

export const initializeUser = createAsyncThunk(
    'user/initializeUser',
    async (_, { rejectWithValue }) => {
        const token = API.getToken();

        if (token) {
            try {
                const user = await API.getUserData();
                return { token, user };
            } catch (error) {
                return rejectWithValue('Failed to fetch user data');
            }
        } else {
            return rejectWithValue('No token found');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        isLoggedIn: false,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.isLoggedIn = true;
                state.loading = false;
                localStorage.setItem('token', action.payload.token); // Store token
                console.log(API.getToken())
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(initializeUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(initializeUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.isLoggedIn = true;
                state.loading = false;
            })
            .addCase(initializeUser.rejected, (state, action) => {
                state.loading = false;
                state.isLoggedIn = false;
                state.error = action.payload;
            })
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.user = null;
                state.isLoggedIn = false;
                state.loading = false;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { } = userSlice.actions;
export default userSlice.reducer;
