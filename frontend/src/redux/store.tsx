import { configureStore } from '@reduxjs/toolkit'
import toastReducer from './slice/toastSlice'
import authReducer from './slice/authSlice'

// Initialize auth state from localStorage
const getInitialAuthState = () => {
    try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
            const user = JSON.parse(userStr);
            return {
                isAuthenticated: true,
                user: user
            };
        }
    } catch (error) {
        console.log('Error parsing auth data from localStorage:', error);
    }
    
    return {
        isAuthenticated: false,
        user: null
    };
};

export const store = configureStore({
    reducer: {
        toast: toastReducer,
        auth: authReducer
    },
    preloadedState: {
        auth: getInitialAuthState()
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch