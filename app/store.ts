import { configureStore } from '@reduxjs/toolkit';

import authReducer from './features/authSlice';
import bondReducer from './features/bondSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		bond: bondReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
