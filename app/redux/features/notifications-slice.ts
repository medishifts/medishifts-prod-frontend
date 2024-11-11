import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
type NotificationItem = {
    id: string;
    collectionId: string;
    collectionName: string;
    created: string;
    message: string;
    read_receipt: string;
    sender: string;
    title: string;
    updated: string;
    url: string;
    user: string;
};

type InitialState = {
    notifications: NotificationItem[];
    unreadCount: number;
};

const initialState: InitialState = {
    notifications: [],
    unreadCount: 0
};

export const notifications = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        // Add a single notification
        addNotification: (state, action: PayloadAction<NotificationItem>) => {
            state.notifications.unshift(action.payload);
            if (!action.payload.read_receipt) {
                state.unreadCount += 1;
            }
        },
        // Add multiple notifications
        setNotifications: (state, action: PayloadAction<NotificationItem[]>) => {
            state.notifications = action.payload;
            state.unreadCount = action.payload.filter(note => !note.read_receipt).length;
        },
        // Mark a notification as read
        markAsRead: (state, action: PayloadAction<string>) => {
            const notification = state.notifications.find(n => n.id === action.payload);
            if (notification && !notification.read_receipt) {
                notification.read_receipt = new Date().toISOString();
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        // Mark all notifications as read
        markAllAsRead: (state) => {
            const currentTime = new Date().toISOString();
            state.notifications.forEach(notification => {
                if (!notification.read_receipt) {
                    notification.read_receipt = currentTime;
                }
            });
            state.unreadCount = 0;
        },
        // Remove a notification
        removeNotification: (state, action: PayloadAction<string>) => {
            const index = state.notifications.findIndex(n => n.id === action.payload);
            if (index !== -1) {
                const wasUnread = !state.notifications[index].read_receipt;
                state.notifications.splice(index, 1);
                if (wasUnread) {
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            }
        },
        // Clear all notifications
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        }
    }
});

export const {
    addNotification,
    setNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications
} = notifications.actions;

export default notifications.reducer;