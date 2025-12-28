'use client';

import * as React from 'react';
import type { Token, TokenCategory, SortOption, SortOrder } from '@/types';
import { useAppSelector } from '@/store/hooks';

/**
 * Compare function factory for sorting tokens
 */
function createCompareFn(sortBy: SortOption, sortOrder: SortOrder) {
    return (a: Token, b: Token): number => {
        let comparison = 0;

        switch (sortBy) {
            case 'price':
                comparison = a.price - b.price;
                break;
            case 'priceChange1m':
                comparison = a.priceChange1m - b.priceChange1m;
                break;
            case 'priceChange5m':
                comparison = a.priceChange5m - b.priceChange5m;
                break;
            case 'priceChange1h':
                comparison = a.priceChange1h - b.priceChange1h;
                break;
            case 'marketCap':
                comparison = a.marketCap - b.marketCap;
                break;
            case 'liquidity':
                comparison = a.liquidity - b.liquidity;
                break;
            case 'volume24h':
                comparison = a.volume24h - b.volume24h;
                break;
            case 'createdAt':
                comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                break;
            case 'holders':
                comparison = a.holders - b.holders;
                break;
            default:
                comparison = 0;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
    };
}

/**
 * Custom hook to get sorted tokens for a category
 * Reads sortConfig from Redux and returns memoized sorted array
 */
export function useSortedTokens(tokens: Token[], category: TokenCategory): Token[] {
    const sortConfig = useAppSelector((state) => state.tokens.sortConfig[category]);

    const sortedTokens = React.useMemo(() => {
        if (!tokens || tokens.length === 0) return tokens;

        const { sortBy, sortOrder } = sortConfig;
        const compareFn = createCompareFn(sortBy, sortOrder);

        return [...tokens].sort(compareFn);
    }, [tokens, sortConfig]);

    return sortedTokens;
}

/**
 * Get human-readable label for sort option
 */
export function getSortLabel(sortBy: SortOption): string {
    const labels: Record<SortOption, string> = {
        price: 'Price',
        priceChange1m: '1m %',
        priceChange5m: '5m %',
        priceChange1h: '1h %',
        marketCap: 'Market Cap',
        liquidity: 'Liquidity',
        volume24h: '24h Volume',
        createdAt: 'Age',
        holders: 'Holders',
    };
    return labels[sortBy];
}

/**
 * All available sort options
 */
export const SORT_OPTIONS: SortOption[] = [
    'price',
    'priceChange1m',
    'priceChange5m',
    'priceChange1h',
    'marketCap',
    'liquidity',
    'volume24h',
    'createdAt',
    'holders',
];
