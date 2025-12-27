'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Calculate relative time from a date
 */
function getRelativeTime(date: Date | string | number): string {
    const now = new Date();
    const targetDate = new Date(date);
    const diffMs = now.getTime() - targetDate.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
        return `${diffSeconds}s`;
    }
    if (diffMinutes < 60) {
        return `${diffMinutes}m`;
    }
    if (diffHours < 24) {
        return `${diffHours}h`;
    }
    if (diffDays < 7) {
        return `${diffDays}d`;
    }
    if (diffDays < 30) {
        return `${Math.floor(diffDays / 7)}w`;
    }
    if (diffDays < 365) {
        return `${Math.floor(diffDays / 30)}mo`;
    }
    return `${Math.floor(diffDays / 365)}y`;
}

interface TimeAgoProps {
    date: Date | string | number;
    showIcon?: boolean;
    updateInterval?: number;
    className?: string;
}

/**
 * TimeAgo component displays relative time from a given date
 * Auto-updates based on the specified interval
 */
export const TimeAgo = React.memo<TimeAgoProps>(({
    date,
    showIcon = false,
    updateInterval = 60000, // Update every minute
    className,
}) => {
    const [relativeTime, setRelativeTime] = React.useState(() => getRelativeTime(date));

    React.useEffect(() => {
        // Update immediately
        setRelativeTime(getRelativeTime(date));

        // Set up interval for updates
        const interval = setInterval(() => {
            setRelativeTime(getRelativeTime(date));
        }, updateInterval);

        return () => clearInterval(interval);
    }, [date, updateInterval]);

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 text-xs text-muted-foreground tabular-nums',
                className
            )}
            title={new Date(date).toLocaleString()}
        >
            {showIcon && <Clock className="h-3 w-3" />}
            {relativeTime}
        </span>
    );
});

TimeAgo.displayName = 'TimeAgo';

/**
 * Compact time display for token rows
 */
interface TimeDisplayProps {
    date: Date | string | number;
    label?: string;
    className?: string;
}

export const TimeDisplay = React.memo<TimeDisplayProps>(({
    date,
    label,
    className,
}) => {
    const [relativeTime, setRelativeTime] = React.useState(() => getRelativeTime(date));

    React.useEffect(() => {
        setRelativeTime(getRelativeTime(date));

        const interval = setInterval(() => {
            setRelativeTime(getRelativeTime(date));
        }, 60000);

        return () => clearInterval(interval);
    }, [date]);

    return (
        <div className={cn('flex flex-col items-center', className)}>
            {label && (
                <span className="text-[9px] text-muted-foreground uppercase">{label}</span>
            )}
            <span className="text-xs text-muted-foreground tabular-nums">{relativeTime}</span>
        </div>
    );
});

TimeDisplay.displayName = 'TimeDisplay';
