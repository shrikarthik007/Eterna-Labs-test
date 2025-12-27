'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Format a number as a price string with appropriate precision
 */
function formatPrice(price: number): string {
    if (price === 0) return '$0.00';

    const absPrice = Math.abs(price);

    if (absPrice >= 1000000) {
        return `$${(price / 1000000).toFixed(2)}M`;
    }
    if (absPrice >= 1000) {
        return `$${(price / 1000).toFixed(2)}K`;
    }
    if (absPrice >= 1) {
        return `$${price.toFixed(2)}`;
    }
    if (absPrice >= 0.01) {
        return `$${price.toFixed(4)}`;
    }
    if (absPrice >= 0.0001) {
        return `$${price.toFixed(6)}`;
    }

    // For very small prices, use subscript notation
    const priceStr = price.toExponential(2);
    const [mantissa, exp] = priceStr.split('e');
    const exponent = Math.abs(parseInt(exp));

    if (exponent > 4) {
        // Show as 0.0₄123 format
        const significantDigits = price.toFixed(exponent + 3).slice(exponent + 1);
        return `$0.0₍${exponent}₎${significantDigits.slice(0, 4)}`;
    }

    return `$${price.toFixed(8)}`;
}

interface PriceCellProps {
    price: number;
    previousPrice?: number;
    showAnimation?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

/**
 * PriceCell component displays a price with optional animation
 * when the price changes (green flash for increase, red for decrease)
 */
export const PriceCell = React.memo<PriceCellProps>(({
    price,
    previousPrice,
    showAnimation = true,
    size = 'md',
    className,
}) => {
    const [animationClass, setAnimationClass] = React.useState('');
    const prevPriceRef = React.useRef(previousPrice ?? price);

    React.useEffect(() => {
        if (!showAnimation) return;

        const prevPrice = prevPriceRef.current;

        if (price > prevPrice) {
            setAnimationClass('animate-price-up');
        } else if (price < prevPrice) {
            setAnimationClass('animate-price-down');
        }

        prevPriceRef.current = price;

        // Clear animation class after animation completes
        const timer = setTimeout(() => {
            setAnimationClass('');
        }, 600);

        return () => clearTimeout(timer);
    }, [price, showAnimation]);

    const sizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };

    return (
        <span
            className={cn(
                'font-mono tabular-nums font-medium transition-colors rounded px-1 -mx-1',
                sizes[size],
                animationClass,
                className
            )}
        >
            {formatPrice(price)}
        </span>
    );
});

PriceCell.displayName = 'PriceCell';

/**
 * Market cap display component
 */
interface MarketCapCellProps {
    value: number;
    className?: string;
}

export const MarketCapCell = React.memo<MarketCapCellProps>(({
    value,
    className,
}) => {
    const formatMarketCap = (mc: number): string => {
        if (mc >= 1000000000) {
            return `$${(mc / 1000000000).toFixed(2)}B`;
        }
        if (mc >= 1000000) {
            return `$${(mc / 1000000).toFixed(2)}M`;
        }
        if (mc >= 1000) {
            return `$${(mc / 1000).toFixed(2)}K`;
        }
        return `$${mc.toFixed(2)}`;
    };

    return (
        <span
            className={cn(
                'font-mono tabular-nums text-xs text-muted-foreground',
                className
            )}
        >
            {formatMarketCap(value)}
        </span>
    );
});

MarketCapCell.displayName = 'MarketCapCell';
