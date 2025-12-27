import * as React from 'react';
import { cn } from '@/lib/utils';
import {
    Search,
    Settings,
    Filter,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    X,
    Check,
    Plus,
    Minus,
    ExternalLink,
    Copy,
    Bookmark,
    BookmarkCheck,
    Zap,
    TrendingUp,
    TrendingDown,
    Activity,
    BarChart3,
    Clock,
    Users,
    Wallet,
    Globe,
    Twitter,
    Send,
    Menu,
    MoreHorizontal,
    MoreVertical,
    RefreshCw,
    AlertCircle,
    AlertTriangle,
    Info,
    HelpCircle,
    Eye,
    EyeOff,
    Volume2,
    VolumeX,
    Sun,
    Moon,
    Loader2,
    type LucideIcon,
} from 'lucide-react';

// Re-export Lucide icons for easy access
export {
    Search,
    Settings,
    Filter,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    X,
    Check,
    Plus,
    Minus,
    ExternalLink,
    Copy,
    Bookmark,
    BookmarkCheck,
    Zap,
    TrendingUp,
    TrendingDown,
    Activity,
    BarChart3,
    Clock,
    Users,
    Wallet,
    Globe,
    Twitter,
    Send,
    Menu,
    MoreHorizontal,
    MoreVertical,
    RefreshCw,
    AlertCircle,
    AlertTriangle,
    Info,
    HelpCircle,
    Eye,
    EyeOff,
    Volume2,
    VolumeX,
    Sun,
    Moon,
    Loader2,
};

/**
 * Custom chain icons
 */
export const SolanaIcon = React.forwardRef<
    SVGSVGElement,
    React.SVGProps<SVGSVGElement>
>(({ className, ...props }, ref) => (
    <svg
        ref={ref}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('h-4 w-4', className)}
        {...props}
    >
        <path
            d="M5.17 16.58L7.62 14.06C7.7 13.97 7.81 13.93 7.93 13.93H19.49C19.68 13.93 19.78 14.16 19.65 14.3L17.2 16.82C17.12 16.91 17.01 16.95 16.89 16.95H5.33C5.14 16.95 5.04 16.72 5.17 16.58Z"
            fill="url(#solana-gradient-1)"
        />
        <path
            d="M5.17 7.18L7.62 9.7C7.7 9.79 7.81 9.83 7.93 9.83H19.49C19.68 9.83 19.78 9.6 19.65 9.46L17.2 6.94C17.12 6.85 17.01 6.81 16.89 6.81H5.33C5.14 6.81 5.04 7.04 5.17 7.18Z"
            fill="url(#solana-gradient-2)"
        />
        <path
            d="M17.2 11.68L14.75 9.16C14.67 9.07 14.56 9.03 14.44 9.03H2.88C2.69 9.03 2.59 9.26 2.72 9.4L5.17 11.92C5.25 12.01 5.36 12.05 5.48 12.05H17.04C17.23 12.05 17.33 11.82 17.2 11.68Z"
            fill="url(#solana-gradient-3)"
        />
        <defs>
            <linearGradient id="solana-gradient-1" x1="5" y1="14" x2="20" y2="17" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FFA3" />
                <stop offset="1" stopColor="#DC1FFF" />
            </linearGradient>
            <linearGradient id="solana-gradient-2" x1="5" y1="7" x2="20" y2="10" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FFA3" />
                <stop offset="1" stopColor="#DC1FFF" />
            </linearGradient>
            <linearGradient id="solana-gradient-3" x1="2.5" y1="9" x2="17.5" y2="12" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FFA3" />
                <stop offset="1" stopColor="#DC1FFF" />
            </linearGradient>
        </defs>
    </svg>
));
SolanaIcon.displayName = 'SolanaIcon';

export const BNBIcon = React.forwardRef<
    SVGSVGElement,
    React.SVGProps<SVGSVGElement>
>(({ className, ...props }, ref) => (
    <svg
        ref={ref}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('h-4 w-4', className)}
        {...props}
    >
        <path
            d="M12 4L8.5 7.5L10.25 9.25L12 7.5L13.75 9.25L15.5 7.5L12 4Z"
            fill="#F0B90B"
        />
        <path
            d="M6.5 9.5L4 12L6.5 14.5L9 12L6.5 9.5Z"
            fill="#F0B90B"
        />
        <path
            d="M12 10L10.25 11.75L12 13.5L13.75 11.75L12 10Z"
            fill="#F0B90B"
        />
        <path
            d="M17.5 9.5L15 12L17.5 14.5L20 12L17.5 9.5Z"
            fill="#F0B90B"
        />
        <path
            d="M12 16.5L8.5 13L6.75 14.75L12 20L17.25 14.75L15.5 13L12 16.5Z"
            fill="#F0B90B"
        />
    </svg>
));
BNBIcon.displayName = 'BNBIcon';

/**
 * Connection status indicator icons
 */
export const ConnectionIcon = React.forwardRef<
    HTMLSpanElement,
    { status: 'connected' | 'connecting' | 'disconnected' | 'error'; className?: string }
>(({ status, className }, ref) => {
    const colors = {
        connected: 'bg-[var(--success)]',
        connecting: 'bg-[var(--warning)] animate-pulse',
        disconnected: 'bg-muted-foreground',
        error: 'bg-[var(--destructive)]',
    };

    return (
        <span
            ref={ref}
            className={cn(
                'inline-block h-2 w-2 rounded-full',
                colors[status],
                className
            )}
            aria-label={`Connection status: ${status}`}
        />
    );
});
ConnectionIcon.displayName = 'ConnectionIcon';

/**
 * Token placeholder icon for when no icon is available
 */
export const TokenPlaceholderIcon = React.forwardRef<
    HTMLDivElement,
    { ticker?: string; className?: string; size?: 'sm' | 'md' | 'lg' }
>(({ ticker, className, size = 'md' }, ref) => {
    const sizes = {
        sm: 'h-6 w-6 text-[10px]',
        md: 'h-8 w-8 text-xs',
        lg: 'h-10 w-10 text-sm',
    };

    // Generate a consistent color based on ticker
    const getColorFromTicker = (t: string): string => {
        const colors = [
            'bg-blue-500',
            'bg-green-500',
            'bg-purple-500',
            'bg-orange-500',
            'bg-pink-500',
            'bg-cyan-500',
            'bg-yellow-500',
            'bg-red-500',
        ];
        const hash = t.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    const displayText = ticker ? ticker.replace('$', '').slice(0, 2).toUpperCase() : '??';
    const bgColor = ticker ? getColorFromTicker(ticker) : 'bg-muted';

    return (
        <div
            ref={ref}
            className={cn(
                'flex items-center justify-center rounded-md font-semibold text-white',
                sizes[size],
                bgColor,
                className
            )}
        >
            {displayText}
        </div>
    );
});
TokenPlaceholderIcon.displayName = 'TokenPlaceholderIcon';

/**
 * Icon wrapper component for consistent sizing and styling
 */
export interface IconProps {
    icon: LucideIcon;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
};

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
    ({ icon: IconComponent, size = 'md', className }, ref) => {
        return (
            <IconComponent
                ref={ref}
                className={cn(iconSizes[size], className)}
            />
        );
    }
);
Icon.displayName = 'Icon';
