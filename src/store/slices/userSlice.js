import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../services/API';

export const login = createAsyncThunk(
    'user/login',
    async ({ username, password }, { rejectWithValue }) => {
        try {
            const data = await API.login(username, password);
            const token = typeof data === 'string' ? data : data.token;

            if (token) {
                API.setToken(token);
                // After successful login, immediately fetch user profile
                const user = await API.getUserData();
                return { token, user };
            }
            return rejectWithValue('No token received');
        } catch (error) {
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

export const register = createAsyncThunk(
    'user/register',
    async ({ username, email, password }, { rejectWithValue }) => {
        try {
            await API.register(username, email, password);
            return { success: true };
        } catch (error) {
            return rejectWithValue(error.message || 'Registration failed');
        }
    }
);

export const logout = createAsyncThunk(
    'user/logout',
    async () => {
        API.clearToken();
        return;
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
                API.clearToken();
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
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
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
                // state.error = action.payload; // Usually don't show init error to user
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isLoggedIn = false;
                state.loading = false;
                state.error = null;
            });
    },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
