'use client';

import * as React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PercentageChangeProps {
    value: number;
    showIcon?: boolean;
    showSign?: boolean;
    size?: 'xs' | 'sm' | 'md';
    className?: string;
}

/**
 * PercentageChange component displays a percentage with color coding
 * Green for positive values, red for negative values
 */
export const PercentageChange = React.memo<PercentageChangeProps>(({
    value,
    showIcon = false,
    showSign = true,
    size = 'sm',
    className,
}) => {
    const isPositive = value > 0;
    const isNeutral = value === 0;

    const sizes = {
        xs: 'text-[10px]',
        sm: 'text-xs',
        md: 'text-sm',
    };

    const iconSizes = {
        xs: 'h-2.5 w-2.5',
        sm: 'h-3 w-3',
        md: 'h-3.5 w-3.5',
    };

    const formattedValue = `${showSign && isPositive ? '+' : ''}${value.toFixed(2)}%`;

    return (
        <span
            className={cn(
                'inline-flex items-center gap-0.5 font-mono tabular-nums font-medium',
                sizes[size],
                isNeutral
                    ? 'text-muted-foreground'
                    : isPositive
                        ? 'text-[var(--success)]'
                        : 'text-[var(--destructive)]',
                className
            )}
        >
            {showIcon && !isNeutral && (
                isPositive
                    ? <TrendingUp className={iconSizes[size]} />
                    : <TrendingDown className={iconSizes[size]} />
            )}
            {formattedValue}
        </span>
    );
});

PercentageChange.displayName = 'PercentageChange';

/**
 * Compact percentage badge for table cells
 */
interface PercentageBadgeProps {
    value: number;
    className?: string;
}

export const PercentageBadge = React.memo<PercentageBadgeProps>(({
    value,
    className,
}) => {
    const isPositive = value > 0;
    const isNeutral = value === 0;

    return (
        <span
            className={cn(
                'inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-mono tabular-nums font-medium',
                isNeutral
                    ? 'bg-muted text-muted-foreground'
                    : isPositive
                        ? 'bg-[var(--success-muted)] text-[var(--success)]'
                        : 'bg-[var(--error-muted)] text-[var(--destructive)]',
                className
            )}
        >
            {isPositive ? '+' : ''}{value.toFixed(1)}%
        </span>
    );
});

PercentageBadge.displayName = 'PercentageBadge';

/**
 * Multi-timeframe percentage display
 */
interface MultiTimeframePercentageProps {
    value1m?: number;
    value5m?: number;
    value1h?: number;
    value24h?: number;
    className?: string;
}

export const MultiTimeframePercentage = React.memo<MultiTimeframePercentageProps>(({
    value1m,
    value5m,
    value1h,
    value24h,
    className,
}) => {
    const timeframes = [
        { label: '1m', value: value1m },
        { label: '5m', value: value5m },
        { label: '1h', value: value1h },
        { label: '24h', value: value24h },
    ].filter(tf => tf.value !== undefined);

    return (
        <div className={cn('flex items-center gap-2', className)}>
            {timeframes.map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center">
                    <span className="text-[9px] text-muted-foreground uppercase">{label}</span>
                    <PercentageChange value={value!} size="xs" showSign={true} />
                </div>
            ))}
        </div>
    );
});

MultiTimeframePercentage.displayName = 'MultiTimeframePercentage';
