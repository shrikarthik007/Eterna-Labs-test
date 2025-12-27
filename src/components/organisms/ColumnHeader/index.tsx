'use client';

import * as React from 'react';
import { Zap, SlidersHorizontal, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TokenCategory } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setActivePreset } from '@/store/slices/tokensSlice';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface ColumnHeaderProps {
    title: string;
    category: TokenCategory;
    activityCount?: number;
    onFilterClick?: () => void;
    className?: string;
}

type PresetType = 'P1' | 'P2' | 'P3';
const presets: PresetType[] = ['P1', 'P2', 'P3'];

/**
 * ColumnHeader component for the token discovery table columns.
 * Displays title, activity indicator, preset buttons, and filter icon.
 */
export const ColumnHeader = React.memo<ColumnHeaderProps>(({
    title,
    category,
    activityCount = 0,
    onFilterClick,
    className,
}) => {
    const dispatch = useAppDispatch();
    const activePreset = useAppSelector(
        (state) => state.tokens.activePresets[category]
    );

    const handlePresetClick = React.useCallback((preset: PresetType) => {
        dispatch(setActivePreset({ category, preset }));
    }, [dispatch, category]);

    return (
        <div
            className={cn(
                'flex items-center justify-between px-3 py-2.5',
                'border-b border-border/50',
                'bg-card sticky top-0 z-10',
                className
            )}
        >
            {/* Title */}
            <h3 className="text-sm font-semibold text-foreground">
                {title}
            </h3>

            {/* Actions */}
            <div className="flex items-center gap-2">
                {/* Activity Indicator */}
                <div
                    className={cn(
                        'flex items-center gap-1 px-1.5 py-0.5 rounded',
                        'text-[10px] font-medium tabular-nums',
                        activityCount > 0
                            ? 'bg-warning/15 text-warning'
                            : 'bg-muted text-muted-foreground'
                    )}
                >
                    <Zap className="h-3 w-3" />
                    <span>{activityCount}</span>
                </div>

                {/* Preset Buttons */}
                <div className="flex items-center rounded bg-secondary/50 p-0.5">
                    {presets.map((preset) => (
                        <button
                            key={preset}
                            onClick={() => handlePresetClick(preset)}
                            className={cn(
                                'px-2 py-0.5 text-[10px] font-medium rounded transition-colors',
                                activePreset === preset
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {preset}
                        </button>
                    ))}
                </div>

                {/* View Mode Icon */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            className={cn(
                                'p-1 rounded transition-colors',
                                'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                            )}
                        >
                            <List className="h-3.5 w-3.5" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        <p>View Mode</p>
                    </TooltipContent>
                </Tooltip>

                {/* Filter Icon */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={onFilterClick}
                            className={cn(
                                'p-1 rounded transition-colors',
                                'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                            )}
                        >
                            <SlidersHorizontal className="h-3.5 w-3.5" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        <p>Filters</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    );
});

ColumnHeader.displayName = 'ColumnHeader';
