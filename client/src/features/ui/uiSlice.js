import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'dark',
  sidebarOpen: false,
  notifications: [],
  onboardingComplete: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setNotifications(state, action) {
      state.notifications = Array.isArray(action.payload) ? action.payload : [];
    },
    addNotification(state, action) {
      const incoming = action.payload;
      const incomingId = incoming?._id || incoming?.id;
      const existingIndex = state.notifications.findIndex((notification) => (notification._id || notification.id) === incomingId);

      if (existingIndex >= 0) {
        state.notifications[existingIndex] = incoming;
      } else {
        state.notifications.push(incoming);
      }
    },
    removeNotification(state, action) {
      state.notifications = state.notifications.filter((notification) => (notification._id || notification.id) !== action.payload);
    },
    completeOnboarding(state) {
      state.onboardingComplete = true;
    }
  }
});

export const { toggleTheme, toggleSidebar, setNotifications, addNotification, removeNotification, completeOnboarding } = uiSlice.actions;
export default uiSlice.reducer;
