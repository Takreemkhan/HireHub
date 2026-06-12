import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  activeRole: 'client' | 'freelancer' | null;
  profileSetupComplete: boolean;
  preferences: {
    emailNotifications: boolean;
    currency: string;
  };
}

const initialState: AuthState = {
  activeRole: null,
  profileSetupComplete: false,
  preferences: {
    emailNotifications: true,
    currency: 'USD',
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setActiveRole(state, action: PayloadAction<'client' | 'freelancer' | null>) {
      state.activeRole = action.payload;
    },
    setProfileSetupComplete(state, action: PayloadAction<boolean>) {
      state.profileSetupComplete = action.payload;
    },
    updatePreferences(state, action: PayloadAction<Partial<AuthState['preferences']>>) {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    clearAuthData(state) {
      state.activeRole = null;
      state.profileSetupComplete = false;
    }
  },
});

export const { setActiveRole, setProfileSetupComplete, updatePreferences, clearAuthData } = authSlice.actions;
export default authSlice.reducer;
