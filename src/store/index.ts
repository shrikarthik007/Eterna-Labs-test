import { configureStore } from '@reduxjs/toolkit';
import tokensReducer from './slices/tokensSlice';

/**
 * Configure Redux store with all reducers
 */
export const store = configureStore({
    reducer: {
        tokens: tokensReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore non-serializable values in these action types
                ignoredActions: ['tokens/setTokens', 'tokens/addToken'],
                ignoredPaths: ['tokens.newPairs', 'tokens.finalStretch', 'tokens.migrated'],
            },
        }),
    devTools: process.env.NODE_ENV !== 'production',
});

// Infer types from store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
