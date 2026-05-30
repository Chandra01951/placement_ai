import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    notifications: [],
    theme: 'dark',
  },
  reducers: {
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    addNotification: (state, action) => {
      state.notifications.unshift({ id: Date.now(), ...action.payload });
      if (state.notifications.length > 10) state.notifications.pop();
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    toggleTheme: (state) => { state.theme = state.theme === 'dark' ? 'light' : 'dark'; },
  },
});

export const { toggleSidebar, addNotification, removeNotification, toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;
