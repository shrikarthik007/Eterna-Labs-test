// Type definitions for Axiom Trade Token Discovery Table

/**
 * Represents a single token/trading pair
 */
export interface Token {
  id: string;
  name: string;
  ticker: string;
  icon?: string;
  price: number;
  priceChange1m: number;
  priceChange5m: number;
  priceChange1h: number;
  priceChange24h: number;
  marketCap: number;
  liquidity: number;
  volume24h: number;
  createdAt: Date;
  holders: number;
  txCount: number;
  category: TokenCategory;
}

/**
 * Token categories for the three-column layout
 */
export type TokenCategory = 'new-pairs' | 'final-stretch' | 'migrated';

/**
 * Price update event from WebSocket
 */
export interface PriceUpdate {
  tokenId: string;
  price: number;
  priceChange1m: number;
  priceChange5m: number;
  timestamp: number;
}

/**
 * Sort options for token columns
 */
export type SortOption = 
  | 'price'
  | 'priceChange1m'
  | 'priceChange5m'
  | 'priceChange1h'
  | 'marketCap'
  | 'liquidity'
  | 'volume24h'
  | 'createdAt'
  | 'holders';

/**
 * Sort order
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Column configuration
 */
export interface ColumnConfig {
  id: TokenCategory;
  title: string;
  preset: 'P1' | 'P2' | 'P3';
  sortBy: SortOption;
  sortOrder: SortOrder;
}

/**
 * Connection status for WebSocket
 */
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

/**
 * Loading states for components
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  error: string | null;
  timestamp: number;
}

/**
 * Token detail modal data
 */
export interface TokenDetail extends Token {
  description?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  priceHistory: { time: number; price: number }[];
}
