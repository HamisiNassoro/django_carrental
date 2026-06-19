import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const formatApiError = (error) => {
  const data = error.response?.data;
  if (!data) {
    return error.message || error.toString();
  }
  if (typeof data === "string") {
    return data;
  }
  if (data.detail) {
    if (data.detail === "No active account found with the given credentials") {
      return "Invalid email or password. If you registered before activation was disabled, try registering again or reset your password.";
    }
    return data.detail;
  }
  if (data.message) {
    return data.message;
  }
  return Object.entries(data)
    .map(([field, value]) => {
      const message = Array.isArray(value) ? value.join(", ") : String(value);
      return `${field}: ${message}`;
    })
    .join("; ");
};

const loadStoredUser = () => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const initialState = {
  user: loadStoredUser(),
  isError: false,
  isSuccess: false,
  isLoading: false,
  isInitialized: false,
  message: "",
};

export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      return await authService.register(user);
    } catch (error) {
      return thunkAPI.rejectWithValue(formatApiError(error));
    }
  }
);

export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    return await authService.login(user);
  } catch (error) {
    return thunkAPI.rejectWithValue(formatApiError(error));
  }
});

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, thunkAPI) => {
    try {
      return await authService.getCurrentUser();
    } catch (error) {
      authService.clearAuth();
      return thunkAPI.rejectWithValue(formatApiError(error));
    }
  }
);

export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, thunkAPI) => {
    if (!authService.getToken()) {
      return null;
    }
    try {
      return await authService.getCurrentUser();
    } catch (error) {
      authService.clearAuth();
      return thunkAPI.rejectWithValue(formatApiError(error));
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  authService.logout();
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = action.payload;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = null;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isSuccess = false;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
