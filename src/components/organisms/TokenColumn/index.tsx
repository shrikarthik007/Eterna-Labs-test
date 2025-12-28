'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { Token, TokenCategory } from '@/types';
import { ColumnHeader } from '../ColumnHeader';
import { TokenRow, TokenRowSkeleton } from '../TokenRow';
import { useSortedTokens } from '@/hooks/useSortedTokens';

interface TokenColumnProps {
    category: TokenCategory;
    title: string;
    tokens: Token[];
    loading?: boolean;
    activityCount?: number;
    onTokenClick?: (token: Token) => void;
    onFilterClick?: () => void;
    className?: string;
}

const CATEGORY_TITLES: Record<TokenCategory, string> = {
    'new-pairs': 'New Pairs',
    'final-stretch': 'Final Stretch',
    'migrated': 'Migrated',
};

/**
 * TokenColumn component wraps a category of tokens with header and scrollable list.
 * Each column is independently scrollable matching Axiom's Pulse page behavior.
 */
export const TokenColumn = React.memo<TokenColumnProps>(({
    category,
    title,
    tokens,
    loading = false,
    activityCount = 0,
    onTokenClick,
    onFilterClick,
    className,
}) => {
    const displayTitle = title || CATEGORY_TITLES[category];

    // Use sorted tokens based on Redux sortConfig
    const sortedTokens = useSortedTokens(tokens, category);

    return (
        <div
            className={cn(
                'flex flex-col h-full',
                'bg-card border-r border-border/30 last:border-r-0',
                className
            )}
        >
            {/* Sticky Header */}
            <ColumnHeader
                title={displayTitle}
                category={category}
                activityCount={activityCount}
                onFilterClick={onFilterClick}
            />

            {/* Scrollable Token List */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    // Loading skeletons
                    <div className="animate-fade-in">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <TokenRowSkeleton key={index} />
                        ))}
                    </div>
                ) : sortedTokens.length === 0 ? (
                    // Empty state
                    <div className="flex flex-col items-center justify-center h-32 text-center px-4">
                        <p className="text-sm text-muted-foreground">
                            No tokens found
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                            Tokens will appear here when available
                        </p>
                    </div>
                ) : (
                    // Token list
                    <div className="animate-fade-in">
                        {sortedTokens.map((token) => (
                            <TokenRow
                                key={token.id}
                                token={token}
                                onClick={onTokenClick}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
});

TokenColumn.displayName = 'TokenColumn';

