'use client';

import * as React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { Token } from '@/types';
import { TokenIcon } from '@/components/molecules/TokenIcon';
import { PriceCell, MarketCapCell } from '@/components/molecules/PriceCell';
import { PercentageBadge } from '@/components/molecules/PercentageChange';
import { TimeAgo } from '@/components/molecules/TimeAgo';
import { ExternalLink, Globe, Twitter } from 'lucide-react';

interface TokenDetailModalProps {
    token: Token | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * Format large numbers with abbreviations
 */
function formatNumber(num: number): string {
    if (num >= 1000000000) {
        return `${(num / 1000000000).toFixed(2)}B`;
    }
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(2)}K`;
    }
    return num.toLocaleString();
}

/**
 * Stat item component for the stats grid
 */
const StatItem: React.FC<{
    label: string;
    value: React.ReactNode;
    className?: string;
}> = ({ label, value, className }) => (
    <div className={cn('flex flex-col gap-1', className)}>
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
);

/**
 * TokenDetailModal displays comprehensive token information
 * Opens on row click with full stats, percentages, and social links
 */
export const TokenDetailModal: React.FC<TokenDetailModalProps> = ({
    token,
    open,
    onOpenChange,
}) => {
    if (!token) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-card border-border">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <TokenIcon
                            src={token.icon}
                            ticker={token.ticker}
                            name={token.name}
                            size="lg"
                        />
                        <div className="flex flex-col gap-1">
                            <DialogTitle className="flex items-center gap-2">
                                <span>{token.name}</span>
                                <span className="text-sm font-normal text-muted-foreground">
                                    {token.ticker}
                                </span>
                            </DialogTitle>
                            <PriceCell price={token.price} size="lg" />
                        </div>
                    </div>
                </DialogHeader>

                {/* Percentage Changes */}
                <div className="flex items-center justify-between py-3 border-y border-border/50">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-muted-foreground">1m</span>
                        <PercentageBadge value={token.priceChange1m} />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-muted-foreground">5m</span>
                        <PercentageBadge value={token.priceChange5m} />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-muted-foreground">1h</span>
                        <PercentageBadge value={token.priceChange1h} />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] text-muted-foreground">24h</span>
                        <PercentageBadge value={token.priceChange24h} />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 py-2">
                    <StatItem
                        label="Market Cap"
                        value={<MarketCapCell value={token.marketCap} />}
                    />
                    <StatItem
                        label="Liquidity"
                        value={`$${formatNumber(token.liquidity)}`}
                    />
                    <StatItem
                        label="24h Volume"
                        value={`$${formatNumber(token.volume24h)}`}
                    />
                    <StatItem
                        label="Holders"
                        value={formatNumber(token.holders)}
                    />
                    <StatItem
                        label="Transactions"
                        value={formatNumber(token.txCount)}
                    />
                    <StatItem
                        label="Created"
                        value={<TimeAgo date={token.createdAt} />}
                    />
                </div>

                {/* Social Links Placeholder */}
                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                    <button
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-md',
                            'bg-secondary/50 text-sm text-muted-foreground',
                            'hover:bg-secondary hover:text-foreground transition-colors'
                        )}
                        onClick={() => window.open(`https://solscan.io/token/${token.id}`, '_blank')}
                    >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Explorer
                    </button>
                    <button
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-md',
                            'bg-secondary/50 text-sm text-muted-foreground',
                            'hover:bg-secondary hover:text-foreground transition-colors',
                            'opacity-50 cursor-not-allowed'
                        )}
                        disabled
                    >
                        <Globe className="h-3.5 w-3.5" />
                        Website
                    </button>
                    <button
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 rounded-md',
                            'bg-secondary/50 text-sm text-muted-foreground',
                            'hover:bg-secondary hover:text-foreground transition-colors',
                            'opacity-50 cursor-not-allowed'
                        )}
                        disabled
                    >
                        <Twitter className="h-3.5 w-3.5" />
                        Twitter
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

TokenDetailModal.displayName = 'TokenDetailModal';
