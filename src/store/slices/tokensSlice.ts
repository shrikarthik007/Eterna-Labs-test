import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Token, TokenCategory, SortOption, SortOrder, ConnectionStatus, PriceUpdate } from '@/types';

/**
 * State shape for tokens slice
 */
interface TokensState {
    newPairs: Token[];
    finalStretch: Token[];
    migrated: Token[];
    loading: {
        newPairs: boolean;
        finalStretch: boolean;
        migrated: boolean;
    };
    error: string | null;
    connectionStatus: ConnectionStatus;
    sortConfig: {
        [K in TokenCategory]: {
            sortBy: SortOption;
            sortOrder: SortOrder;
        };
    };
    activePresets: {
        [K in TokenCategory]: 'P1' | 'P2' | 'P3';
    };
    lastUpdated: number | null;
    lastConnectionTime: number | null;
    selectedToken: Token | null;
}

const initialState: TokensState = {
    newPairs: [],
    finalStretch: [],
    migrated: [],
    loading: {
        newPairs: true,
        finalStretch: true,
        migrated: true,
    },
    error: null,
    connectionStatus: 'disconnected',
    sortConfig: {
        'new-pairs': { sortBy: 'createdAt', sortOrder: 'desc' },
        'final-stretch': { sortBy: 'priceChange1m', sortOrder: 'desc' },
        'migrated': { sortBy: 'marketCap', sortOrder: 'desc' },
    },
    activePresets: {
        'new-pairs': 'P1',
        'final-stretch': 'P1',
        'migrated': 'P1',
    },
    lastUpdated: null,
    lastConnectionTime: null,
    selectedToken: null,
};

/**
 * Helper to get category array key
 */
const getCategoryKey = (category: TokenCategory): 'newPairs' | 'finalStretch' | 'migrated' => {
    const map: Record<TokenCategory, 'newPairs' | 'finalStretch' | 'migrated'> = {
        'new-pairs': 'newPairs',
        'final-stretch': 'finalStretch',
        'migrated': 'migrated',
    };
    return map[category];
};

/**
 * Tokens slice with reducers for managing token data
 */
export const tokensSlice = createSlice({
    name: 'tokens',
    initialState,
    reducers: {
        // Set loading state for all categories
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.newPairs = action.payload;
            state.loading.finalStretch = action.payload;
            state.loading.migrated = action.payload;
        },

        // Set loading state for a specific category
        setCategoryLoading: (
            state,
            action: PayloadAction<{ category: TokenCategory; loading: boolean }>
        ) => {
            const { category, loading } = action.payload;
            const key = getCategoryKey(category);
            state.loading[key] = loading;
        },

        // Set error state
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading.newPairs = false;
            state.loading.finalStretch = false;
            state.loading.migrated = false;
        },

        // Set tokens for a specific category
        setTokens: (state, action: PayloadAction<{ category: TokenCategory; tokens: Token[] }>) => {
            const { category, tokens } = action.payload;
            const key = getCategoryKey(category);
            state[key] = tokens;
            state.lastUpdated = Date.now();
        },

        // Update a single token price (for real-time updates)
        updateTokenPrice: (state, action: PayloadAction<PriceUpdate>) => {
            const { tokenId, price, priceChange1m, priceChange5m } = action.payload;

            // Search through all categories
            const categories: ('newPairs' | 'finalStretch' | 'migrated')[] = ['newPairs', 'finalStretch', 'migrated'];

            for (const category of categories) {
                const tokenIndex = state[category].findIndex((t) => t.id === tokenId);
                if (tokenIndex !== -1) {
                    state[category][tokenIndex] = {
                        ...state[category][tokenIndex],
                        price,
                        priceChange1m,
                        priceChange5m,
                    };
                    break;
                }
            }

            state.lastUpdated = Date.now();
        },

        // Batch update multiple token prices
        batchUpdatePrices: (state, action: PayloadAction<PriceUpdate[]>) => {
            const updates = action.payload;
            const categories: ('newPairs' | 'finalStretch' | 'migrated')[] = ['newPairs', 'finalStretch', 'migrated'];

            for (const update of updates) {
                for (const category of categories) {
                    const tokenIndex = state[category].findIndex((t) => t.id === update.tokenId);
                    if (tokenIndex !== -1) {
                        state[category][tokenIndex] = {
                            ...state[category][tokenIndex],
                            price: update.price,
                            priceChange1m: update.priceChange1m,
                            priceChange5m: update.priceChange5m,
                        };
                        break;
                    }
                }
            }

            state.lastUpdated = Date.now();
        },

        // Set connection status
        setConnectionStatus: (state, action: PayloadAction<ConnectionStatus>) => {
            state.connectionStatus = action.payload;
            if (action.payload === 'connected') {
                state.lastConnectionTime = Date.now();
            }
        },

        // Update sort configuration for a category
        setSortConfig: (
            state,
            action: PayloadAction<{
                category: TokenCategory;
                sortBy: SortOption;
                sortOrder: SortOrder;
            }>
        ) => {
            const { category, sortBy, sortOrder } = action.payload;
            state.sortConfig[category] = { sortBy, sortOrder };
        },

        // Set active preset for a category
        setActivePreset: (
            state,
            action: PayloadAction<{
                category: TokenCategory;
                preset: 'P1' | 'P2' | 'P3';
            }>
        ) => {
            const { category, preset } = action.payload;
            state.activePresets[category] = preset;
        },

        // Add a new token to the beginning of a category
        addToken: (state, action: PayloadAction<{ category: TokenCategory; token: Token }>) => {
            const { category, token } = action.payload;
            const key = getCategoryKey(category);
            state[key].unshift(token);
            state.lastUpdated = Date.now();
        },

        // Remove a token from a category
        removeToken: (state, action: PayloadAction<{ category: TokenCategory; tokenId: string }>) => {
            const { category, tokenId } = action.payload;
            const key = getCategoryKey(category);
            state[key] = state[key].filter((t) => t.id !== tokenId);
            state.lastUpdated = Date.now();
        },

        // Set selected token for modal
        setSelectedToken: (state, action: PayloadAction<Token | null>) => {
            state.selectedToken = action.payload;
        },

        // Reset all state
        resetState: () => initialState,
    },
});

export const {
    setLoading,
    setCategoryLoading,
    setError,
    setTokens,
    updateTokenPrice,
    batchUpdatePrices,
    setConnectionStatus,
    setSortConfig,
    setActivePreset,
    addToken,
    removeToken,
    setSelectedToken,
    resetState,
} = tokensSlice.actions;

export default tokensSlice.reducer;

