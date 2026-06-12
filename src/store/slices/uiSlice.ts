import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';
  globalSearchQuery: string;
}

const initialState: UiState = {
  sidebarCollapsed: false,
  theme: 'system',
  globalSearchQuery: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },
    setTheme(state, action: PayloadAction<UiState['theme']>) {
      state.theme = action.payload;
    },
    setGlobalSearchQuery(state, action: PayloadAction<string>) {
      state.globalSearchQuery = action.payload;
    }
  },
});

export const { toggleSidebar, setSidebarCollapsed, setTheme, setGlobalSearchQuery } = uiSlice.actions;
export default uiSlice.reducer;
