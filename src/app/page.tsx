'use client';

import * as React from 'react';
import { PulseGrid } from '@/components/organisms';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTokens, setLoading, batchUpdatePrices, setConnectionStatus } from '@/store/slices/tokensSlice';
import { generateInitialTokens, webSocketMock } from '@/lib/websocket-mock';
import type { Token } from '@/types';

export default function Home() {
  const dispatch = useAppDispatch();
  const { connectionStatus } = useAppSelector((state) => state.tokens);
  const [isClient, setIsClient] = React.useState(false);

  // Initialize mock data on mount
  React.useEffect(() => {
    setIsClient(true);
    dispatch(setLoading(true));

    // Simulate API loading delay
    const loadTimer = setTimeout(() => {
      const mockData = generateInitialTokens(12);

      dispatch(setTokens({ category: 'new-pairs', tokens: mockData.newPairs }));
      dispatch(setTokens({ category: 'final-stretch', tokens: mockData.finalStretch }));
      dispatch(setTokens({ category: 'migrated', tokens: mockData.migrated }));
      dispatch(setLoading(false));
      dispatch(setConnectionStatus('connected'));

      // Start WebSocket mock for real-time updates
      const allTokens = [
        ...mockData.newPairs,
        ...mockData.finalStretch,
        ...mockData.migrated,
      ];
      webSocketMock.start(allTokens);
    }, 800);

    return () => {
      clearTimeout(loadTimer);
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

  const handleTokenClick = React.useCallback((token: Token) => {
    console.log('Token clicked:', token);
    // TODO: Open token detail modal
  }, []);

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
          <div className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${connectionStatus === 'connected'
                  ? 'bg-success animate-pulse'
                  : connectionStatus === 'connecting'
                    ? 'bg-warning animate-pulse'
                    : 'bg-muted-foreground'
                }`}
            />
            <span className="text-xs text-muted-foreground capitalize">
              {connectionStatus}
            </span>
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
    </div>
  );
}
