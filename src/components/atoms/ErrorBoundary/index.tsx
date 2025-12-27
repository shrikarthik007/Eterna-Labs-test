'use client';

import * as React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    onReset?: () => void;
    className?: string;
}

/**
 * Error boundary component for catching and displaying errors
 * Provides a fallback UI and retry functionality
 */
export class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        this.setState({ errorInfo });

        // Call optional error callback
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // Log error in development
        if (process.env.NODE_ENV === 'development') {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });

        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    render(): React.ReactNode {
        if (this.state.hasError) {
            // Custom fallback
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div
                    className={cn(
                        'flex flex-col items-center justify-center p-6 text-center',
                        'min-h-[200px] rounded-lg bg-card border border-border',
                        this.props.className
                    )}
                >
                    <AlertCircle className="h-10 w-10 text-destructive mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-md">
                        {this.state.error?.message || 'An unexpected error occurred'}
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={this.handleReset}
                        className="gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try again
                    </Button>

                    {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                        <details className="mt-4 text-left w-full max-w-lg">
                            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                                View error details
                            </summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-40">
                                {this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

/**
 * Inline error display for smaller error states
 */
interface InlineErrorProps {
    message: string;
    onRetry?: () => void;
    className?: string;
}

export const InlineError: React.FC<InlineErrorProps> = ({
    message,
    onRetry,
    className,
}) => (
    <div
        className={cn(
            'flex items-center gap-2 p-3 rounded-md',
            'bg-destructive/10 text-destructive text-sm',
            className
        )}
    >
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span className="flex-1">{message}</span>
        {onRetry && (
            <button
                onClick={onRetry}
                className="shrink-0 hover:underline underline-offset-2"
            >
                Retry
            </button>
        )}
    </div>
);

/**
 * Empty state component for when no data is available
 */
interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    icon,
    action,
    className,
}) => (
    <div
        className={cn(
            'flex flex-col items-center justify-center p-8 text-center',
            'min-h-[200px]',
            className
        )}
    >
        {icon && (
            <div className="mb-4 text-muted-foreground">
                {icon}
            </div>
        )}
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        {description && (
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                {description}
            </p>
        )}
        {action}
    </div>
);
