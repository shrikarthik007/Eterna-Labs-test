'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { TokenPlaceholderIcon } from '@/components/atoms/Icon';

interface TokenIconProps {
    src?: string;
    ticker?: string;
    name?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    className?: string;
}

const sizes = {
    xs: { container: 'h-5 w-5', image: 20, placeholder: 'sm' as const },
    sm: { container: 'h-6 w-6', image: 24, placeholder: 'sm' as const },
    md: { container: 'h-8 w-8', image: 32, placeholder: 'md' as const },
    lg: { container: 'h-10 w-10', image: 40, placeholder: 'lg' as const },
};

/**
 * TokenIcon component displays a token's icon with fallback to placeholder
 */
export const TokenIcon = React.memo<TokenIconProps>(({
    src,
    ticker,
    name,
    size = 'md',
    className,
}) => {
    const [hasError, setHasError] = React.useState(false);
    const sizeConfig = sizes[size];

    // Reset error state when src changes
    React.useEffect(() => {
        setHasError(false);
    }, [src]);

    // Show placeholder if no src or if image failed to load
    if (!src || hasError) {
        return (
            <TokenPlaceholderIcon
                ticker={ticker}
                size={sizeConfig.placeholder}
                className={className}
            />
        );
    }

    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-md bg-muted shrink-0',
                sizeConfig.container,
                className
            )}
        >
            <Image
                src={src}
                alt={name || ticker || 'Token icon'}
                width={sizeConfig.image}
                height={sizeConfig.image}
                className="object-cover"
                onError={() => setHasError(true)}
                unoptimized // For external URLs
            />
        </div>
    );
});

TokenIcon.displayName = 'TokenIcon';

/**
 * Token info display with icon, name, and ticker
 */
interface TokenInfoProps {
    icon?: string;
    name: string;
    ticker: string;
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
    className?: string;
}

export const TokenInfo = React.memo<TokenInfoProps>(({
    icon,
    name,
    ticker,
    size = 'md',
    showIcon = true,
    className,
}) => {
    const iconSize = size === 'lg' ? 'md' : size === 'md' ? 'sm' : 'xs';

    return (
        <div className={cn('flex items-center gap-2 min-w-0', className)}>
            {showIcon && (
                <TokenIcon
                    src={icon}
                    ticker={ticker}
                    name={name}
                    size={iconSize as 'xs' | 'sm' | 'md' | 'lg'}
                />
            )}
            <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate leading-tight">{name}</span>
                <span className="text-xs text-muted-foreground truncate leading-tight">{ticker}</span>
            </div>
        </div>
    );
});

TokenInfo.displayName = 'TokenInfo';
