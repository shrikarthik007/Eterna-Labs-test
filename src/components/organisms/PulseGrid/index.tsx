'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import type { Token } from '@/types';
import { TokenColumn } from '../TokenColumn';

interface PulseGridProps {
    onTokenClick?: (token: Token) => void;
    className?: string;
}

/**
 * PulseGrid component renders the three-column token discovery layout.
 * Responsive: 1 column on mobile, 2 on tablet, 3 on desktop.
 */
export const PulseGrid = React.memo<PulseGridProps>(({
    onTokenClick,
    className,
}) => {
    const { newPairs, finalStretch, migrated, loading } = useAppSelector(
        (state) => state.tokens
    );

    return (
        <div
            className={cn(
                'pulse-grid h-full',
                className
            )}
        >
            <TokenColumn
                category="new-pairs"
                title="New Pairs"
                tokens={newPairs}
                loading={loading.newPairs}
                activityCount={newPairs.length}
                onTokenClick={onTokenClick}
            />
            <TokenColumn
                category="final-stretch"
                title="Final Stretch"
                tokens={finalStretch}
                loading={loading.finalStretch}
                activityCount={finalStretch.length}
                onTokenClick={onTokenClick}
            />
            <TokenColumn
                category="migrated"
                title="Migrated"
                tokens={migrated}
                loading={loading.migrated}
                activityCount={migrated.length}
                onTokenClick={onTokenClick}
            />
        </div>
    );
});

PulseGrid.displayName = 'PulseGrid';
