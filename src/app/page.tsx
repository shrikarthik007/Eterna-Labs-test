'use client';

import * as React from 'react';
import { PulseGrid, TokenDetailModal } from '@/components/organisms';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setTokens,
  setLoading,
  setCategoryLoading,
  batchUpdatePrices,
  setConnectionStatus,
  setSelectedToken
} from '@/store/slices/tokensSlice';
import { generateProgressiveTokens, webSocketMock } from '@/lib/websocket-mock';
import type { Token, TokenCategory } from '@/types';

export default function Home() {
  const dispatch = useAppDispatch();
  const { connectionStatus, selectedToken, lastConnectionTime } = useAppSelector((state) => state.tokens);
  const [isClient, setIsClient] = React.useState(false);
  const allTokensRef = React.useRef<Token[]>([]);

  // Initialize with progressive loading on mount
  React.useEffect(() => {
    setIsClient(true);
    dispatch(setLoading(true));
    dispatch(setConnectionStatus('connecting'));

    // Small initial delay before starting progressive load
    const startDelay = setTimeout(() => {
      const cleanup = generateProgressiveTokens(
        12, // tokens per category
        (category: TokenCategory, tokens: Token[], isComplete: boolean) => {
          dispatch(setTokens({ category, tokens }));

          if (isComplete) {
            dispatch(setCategoryLoading({ category, loading: false }));

            // Track all tokens for WebSocket mock
            allTokensRef.current = [
              ...allTokensRef.current.filter(t => t.category !== category),
              ...tokens
            ];

            // Start WebSocket mock once all categories are loaded
            const loadingState = {
              'new-pairs': category === 'new-pairs',
              'final-stretch': category === 'final-stretch',
              'migrated': category === 'migrated',
            };

            // Check if this was the last category to complete
            if (allTokensRef.current.length >= 36) {
              dispatch(setConnectionStatus('connected'));
              webSocketMock.start(allTokensRef.current);
            }
          }
        },
        4, // batch size
        120 // delay between batches
      );

      return cleanup;
    }, 200);

    return () => {
      clearTimeout(startDelay);
      webSocketMock.stop();
    };
  }, [dispatch]);

  // Subscribe to WebSocket price updates
  React.useEffect(() => {
    const unsubscribe = webSocketMock.subscribe((updates) => {
      dispatch(batchUpdatePrices(updates));
    });

    return unsubscribe;
  }, [dispatch]);

  // Handle token click - open modal
  const handleTokenClick = React.useCallback((token: Token) => {
    dispatch(setSelectedToken(token));
  }, [dispatch]);

  // Handle modal close
  const handleModalClose = React.useCallback((open: boolean) => {
    if (!open) {
      dispatch(setSelectedToken(null));
    }
  }, [dispatch]);

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-foreground">Pulse</h1>
          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-background/50 hover:bg-muted/50 transition-colors cursor-default"
            title={connectionStatus === 'connected'
              ? `Connected${lastConnectionTime ? ` since ${new Date(lastConnectionTime).toLocaleTimeString()}` : ''}`
              : connectionStatus === 'connecting'
                ? 'Establishing connection...'
                : 'Disconnected from server'}
          >
            <span
              className={`h-2 w-2 rounded-full transition-colors ${connectionStatus === 'connected'
                ? 'bg-success shadow-[0_0_6px_rgba(34,197,94,0.5)] animate-pulse'
                : connectionStatus === 'connecting'
                  ? 'bg-warning animate-pulse'
                  : connectionStatus === 'error'
                    ? 'bg-destructive'
                    : 'bg-muted-foreground'
                }`}
            />
            <span className="text-xs text-muted-foreground capitalize">
              {connectionStatus}
            </span>
            {connectionStatus === 'connected' && lastConnectionTime && (
              <span className="text-[10px] text-muted-foreground/60 ml-1">
                • Live
              </span>
            )}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Axiom Trade Clone
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 overflow-hidden">
        <PulseGrid onTokenClick={handleTokenClick} />
      </main>

      {/* Token Detail Modal */}
      <TokenDetailModal
        token={selectedToken}
        open={selectedToken !== null}
        onOpenChange={handleModalClose}
      />
    </div>
  );
}
