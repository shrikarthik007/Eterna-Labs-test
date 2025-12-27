import * as React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Shimmer effect skeleton component
 * Extends the base skeleton with animated shimmer effect
 */
export const ShimmerSkeleton = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'relative overflow-hidden rounded-md bg-muted',
            'before:absolute before:inset-0',
            'before:translate-x-[-100%]',
            'before:animate-[shimmer_2s_infinite]',
            'before:bg-gradient-to-r',
            'before:from-transparent before:via-white/10 before:to-transparent',
            className
        )}
        {...props}
    />
));
ShimmerSkeleton.displayName = 'ShimmerSkeleton';

/**
 * Token row skeleton for loading states
 */
export const TokenRowSkeleton = React.forwardRef<
    HTMLDivElement,
    { className?: string }
>(({ className }, ref) => (
    <div
        ref={ref}
        className={cn(
            'flex items-center gap-3 px-3 py-2 border-b border-border/50',
            className
        )}
    >
        {/* Token icon skeleton */}
        <ShimmerSkeleton className="h-8 w-8 shrink-0 rounded-md" />

        {/* Token info skeleton */}
        <div className="flex flex-col gap-1 min-w-0 flex-1">
            <ShimmerSkeleton className="h-4 w-20" />
            <ShimmerSkeleton className="h-3 w-14" />
        </div>

        {/* Price skeleton */}
        <div className="flex flex-col items-end gap-1">
            <ShimmerSkeleton className="h-4 w-16" />
            <ShimmerSkeleton className="h-3 w-12" />
        </div>

        {/* Stats skeleton */}
        <div className="hidden sm:flex items-center gap-2">
            <ShimmerSkeleton className="h-4 w-12" />
            <ShimmerSkeleton className="h-4 w-12" />
        </div>
    </div>
));
TokenRowSkeleton.displayName = 'TokenRowSkeleton';

/**
 * Token column skeleton for loading entire column
 */
export const TokenColumnSkeleton = React.forwardRef<
    HTMLDivElement,
    { rowCount?: number; className?: string }
>(({ rowCount = 10, className }, ref) => (
    <div
        ref={ref}
        className={cn('flex flex-col', className)}
    >
        {/* Header skeleton */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <div className="flex items-center gap-2">
                <ShimmerSkeleton className="h-5 w-24" />
                <ShimmerSkeleton className="h-4 w-8" />
            </div>
            <div className="flex items-center gap-1">
                <ShimmerSkeleton className="h-6 w-6 rounded" />
                <ShimmerSkeleton className="h-6 w-6 rounded" />
                <ShimmerSkeleton className="h-6 w-6 rounded" />
            </div>
        </div>

        {/* Rows skeleton */}
        {Array.from({ length: rowCount }).map((_, i) => (
            <TokenRowSkeleton key={i} />
        ))}
    </div>
));
TokenColumnSkeleton.displayName = 'TokenColumnSkeleton';

/**
 * Full page pulse grid skeleton
 */
export const PulseGridSkeleton = React.forwardRef<
    HTMLDivElement,
    { className?: string }
>(({ className }, ref) => (
    <div
        ref={ref}
        className={cn('pulse-grid h-full', className)}
    >
        <TokenColumnSkeleton className="border-r border-border" />
        <TokenColumnSkeleton className="border-r border-border hidden md:flex" />
        <TokenColumnSkeleton className="hidden lg:flex" />
    </div>
));
PulseGridSkeleton.displayName = 'PulseGridSkeleton';

/**
 * Progressive loading skeleton that reveals content
 */
interface ProgressiveSkeletonProps {
    isLoading: boolean;
    children: React.ReactNode;
    skeleton?: React.ReactNode;
    className?: string;
    delay?: number;
}

export const ProgressiveSkeleton: React.FC<ProgressiveSkeletonProps> = ({
    isLoading,
    children,
    skeleton,
    className,
    delay = 0,
}) => {
    const [showContent, setShowContent] = React.useState(!isLoading);

    React.useEffect(() => {
        if (!isLoading) {
            if (delay > 0) {
                const timer = setTimeout(() => setShowContent(true), delay);
                return () => clearTimeout(timer);
            }
            setShowContent(true);
        } else {
            setShowContent(false);
        }
    }, [isLoading, delay]);

    if (!showContent) {
        return (
            <div className={cn('animate-fade-in', className)}>
                {skeleton || <ShimmerSkeleton className="h-full w-full" />}
            </div>
        );
    }

    return (
        <div className={cn('animate-fade-in', className)}>
            {children}
        </div>
    );
};

// Re-export base Skeleton
export { Skeleton };
