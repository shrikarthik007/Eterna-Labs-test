import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Typography component variants using class-variance-authority
 * Provides consistent text styling across the application
 */
const typographyVariants = cva('', {
    variants: {
        variant: {
            // Headings
            h1: 'scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl',
            h2: 'scroll-m-20 text-2xl font-semibold tracking-tight',
            h3: 'scroll-m-20 text-xl font-semibold tracking-tight',
            h4: 'scroll-m-20 text-lg font-semibold tracking-tight',

            // Body text
            p: 'leading-6',
            lead: 'text-lg text-muted-foreground',
            large: 'text-lg font-semibold',
            small: 'text-sm font-medium leading-none',
            muted: 'text-sm text-muted-foreground',

            // Special text
            code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm',
            blockquote: 'mt-6 border-l-2 border-border pl-6 italic',

            // Trading-specific
            price: 'font-mono text-sm tabular-nums tracking-tight',
            priceChange: 'font-mono text-xs tabular-nums font-medium',
            ticker: 'font-semibold uppercase tracking-wide',
            tokenName: 'text-sm font-medium truncate',
            label: 'text-xs font-medium uppercase tracking-wider text-muted-foreground',
            stat: 'text-xs tabular-nums text-muted-foreground',
        },
        textColor: {
            default: 'text-foreground',
            muted: 'text-muted-foreground',
            primary: 'text-primary',
            success: 'text-[var(--success)]',
            error: 'text-[var(--destructive)]',
            warning: 'text-[var(--warning)]',
        },
    },
    defaultVariants: {
        variant: 'p',
        textColor: 'default',
    },
});

/**
 * Element type mapping for semantic HTML
 */
const variantElementMap: Record<string, React.ElementType> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    p: 'p',
    lead: 'p',
    large: 'p',
    small: 'p',
    muted: 'p',
    code: 'code',
    blockquote: 'blockquote',
    price: 'span',
    priceChange: 'span',
    ticker: 'span',
    tokenName: 'span',
    label: 'span',
    stat: 'span',
};

type TypographyVariantProps = VariantProps<typeof typographyVariants>;

export interface TypographyProps
    extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    TypographyVariantProps {
    as?: React.ElementType;
}

/**
 * Typography component for consistent text styling
 * 
 * @example
 * <Typography variant="h1">Page Title</Typography>
 * <Typography variant="price" textColor="success">$0.00123</Typography>
 * <Typography variant="priceChange" textColor="error">-5.23%</Typography>
 */
export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
    ({ className, variant, textColor, as, children, ...props }, ref) => {
        const Component = as || variantElementMap[variant || 'p'] || 'p';

        return React.createElement(
            Component,
            {
                ref,
                className: cn(typographyVariants({ variant, textColor }), className),
                ...props,
            },
            children
        );
    }
);

Typography.displayName = 'Typography';

// Convenience components for common use cases
export const H1: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
    <Typography variant="h1" as="h1" {...props} />
);

export const H2: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
    <Typography variant="h2" as="h2" {...props} />
);

export const H3: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
    <Typography variant="h3" as="h3" {...props} />
);

export const H4: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
    <Typography variant="h4" as="h4" {...props} />
);

export const Text: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
    <Typography variant="p" as="p" {...props} />
);

export const MutedText: React.FC<Omit<TypographyProps, 'variant' | 'as' | 'textColor'>> = (props) => (
    <Typography variant="muted" as="p" {...props} />
);
