'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { Token } from '@/types';
import { TokenIcon } from '@/components/molecules/TokenIcon';
import { PriceCell } from '@/components/molecules/PriceCell';
import { PercentageBadge } from '@/components/molecules/PercentageChange';
import { TimeAgo } from '@/components/molecules/TimeAgo';

interface TokenRowProps {
    token: Token;
    onClick?: (token: Token) => void;
    className?: string;
}

/**
 * TokenRow component displays a complete token entry in the discovery table.
 * Matches Axiom Trade's Pulse page design with icon, name, price, percentages, and time.
 */
export const TokenRow = React.memo<TokenRowProps>(({
    token,
    onClick,
    className,
}) => {
    const handleClick = React.useCallback(() => {
        onClick?.(token);
    }, [onClick, token]);

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.(token);
        }
    }, [onClick, token]);

    return (
        <div
            role="button"
            tabIndex={onClick ? 0 : undefined}
            onClick={onClick ? handleClick : undefined}
            onKeyDown={onClick ? handleKeyDown : undefined}
            className={cn(
                'flex items-center gap-3 px-3 py-2.5 token-row-hover cursor-pointer',
                'border-b border-border-muted last:border-b-0',
                className
            )}
        >
            {/* Token Icon & Info */}
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <TokenIcon
                    src={token.icon}
                    ticker={token.ticker}
                    name={token.name}
                    size="sm"
                />
                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-foreground truncate">
                            {token.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {token.ticker}
                        </span>
                    </div>
                    <PriceCell price={token.price} size="sm" />
                </div>
            </div>

            {/* Percentage Changes */}
            <div className="flex items-center gap-1 shrink-0">
                <PercentageBadge value={token.priceChange5m} />
                <PercentageBadge value={token.priceChange1h} />
                <PercentageBadge value={token.priceChange24h} />
            </div>

            {/* Time Ago */}
            <TimeAgo
                date={token.createdAt}
                className="shrink-0 w-8 text-right"
            />
        </div>
    );
});

TokenRow.displayName = 'TokenRow';

/**
 * TokenRowSkeleton - Loading placeholder for TokenRow
 */
export const TokenRowSkeleton: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div
            className={cn(
                'flex items-center gap-3 px-3 py-2.5',
                'border-b border-border-muted',
                className
            )}
        >
            {/* Icon skeleton */}
            <div className="h-6 w-6 rounded-md bg-muted animate-shimmer shrink-0" />

            {/* Name & price skeleton */}
            <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                    <div className="h-4 w-20 rounded bg-muted animate-shimmer" />
                    <div className="h-3 w-10 rounded bg-muted animate-shimmer" />
                </div>
                <div className="h-3 w-14 rounded bg-muted animate-shimmer" />
            </div>

            {/* Percentage skeletons */}
            <div className="flex items-center gap-1 shrink-0">
                <div className="h-5 w-12 rounded bg-muted animate-shimmer" />
                <div className="h-5 w-12 rounded bg-muted animate-shimmer" />
                <div className="h-5 w-12 rounded bg-muted animate-shimmer" />
            </div>

            {/* Time skeleton */}
            <div className="h-3 w-6 rounded bg-muted animate-shimmer shrink-0" />
        </div>
    );
};
