import type { Token, TokenCategory, PriceUpdate } from '@/types';

// Token name prefixes and suffixes for generating realistic names
const namePrefixes = [
    'Moon', 'Doge', 'Shiba', 'Pepe', 'Floki', 'Baby', 'Safe', 'Elon',
    'Chad', 'Giga', 'Based', 'Alpha', 'Sigma', 'Turbo', 'Mega', 'Ultra',
    'Super', 'Hyper', 'Quantum', 'Cosmic', 'Solar', 'Lunar', 'Stellar',
    'Galactic', 'Atomic', 'Zen', 'Ninja', 'Samurai', 'Dragon', 'Phoenix'
];

const nameSuffixes = [
    'Inu', 'Coin', 'Token', 'Dog', 'Cat', 'Moon', 'Mars', 'AI',
    'Bot', 'Swap', 'Fi', 'Dex', 'Chain', 'Protocol', 'Network',
    'Verse', 'World', 'Land', 'City', 'Kingdom', 'Empire', 'Hub'
];

/**
 * Generate a random token name and ticker
 */
function generateTokenName(): { name: string; ticker: string } {
    const prefix = namePrefixes[Math.floor(Math.random() * namePrefixes.length)];
    const suffix = nameSuffixes[Math.floor(Math.random() * nameSuffixes.length)];
    const name = `${prefix}${suffix}`;
    const ticker = `$${prefix.toUpperCase().slice(0, 3)}${suffix.toUpperCase().slice(0, 1)}`;
    return { name, ticker };
}

/**
 * Generate a random price in realistic range
 */
function generatePrice(): number {
    const magnitude = Math.random();
    if (magnitude < 0.3) {
        // Very small price tokens (memecoins)
        return Math.random() * 0.0001;
    } else if (magnitude < 0.6) {
        // Small price tokens
        return Math.random() * 0.01;
    } else if (magnitude < 0.85) {
        // Medium price tokens
        return Math.random() * 1;
    } else {
        // Higher price tokens
        return Math.random() * 100;
    }
}

/**
 * Generate a random percentage change
 */
function generatePercentageChange(volatility: number = 1): number {
    const change = (Math.random() - 0.5) * 2 * volatility * 50;
    return Math.round(change * 100) / 100;
}

/**
 * Generate a single mock token
 */
export function generateMockToken(category: TokenCategory): Token {
    const { name, ticker } = generateTokenName();
    const price = generatePrice();
    const marketCap = price * (Math.random() * 1000000000 + 10000);

    return {
        id: `${category}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        ticker,
        icon: undefined, // Will use placeholder
        price,
        priceChange1m: generatePercentageChange(1),
        priceChange5m: generatePercentageChange(1.5),
        priceChange1h: generatePercentageChange(2),
        priceChange24h: generatePercentageChange(3),
        marketCap,
        liquidity: marketCap * (Math.random() * 0.5 + 0.1),
        volume24h: marketCap * (Math.random() * 0.3 + 0.05),
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 7),
        holders: Math.floor(Math.random() * 10000) + 10,
        txCount: Math.floor(Math.random() * 50000) + 100,
        category,
    };
}

/**
 * Generate initial mock data for all categories
 */
export function generateInitialTokens(count: number = 15): {
    newPairs: Token[];
    finalStretch: Token[];
    migrated: Token[];
} {
    return {
        newPairs: Array.from({ length: count }, () => generateMockToken('new-pairs')),
        finalStretch: Array.from({ length: count }, () => generateMockToken('final-stretch')),
        migrated: Array.from({ length: count }, () => generateMockToken('migrated')),
    };
}

/**
 * Progressive token generation callback type
 */
type ProgressiveCallback = (
    category: TokenCategory,
    tokens: Token[],
    isComplete: boolean
) => void;

/**
 * Generate tokens progressively for a smooth loading experience.
 * Tokens are generated in batches with staggered timing across categories.
 * 
 * @param countPerCategory - Number of tokens to generate per category
 * @param onBatch - Callback fired for each batch of tokens
 * @param batchSize - Number of tokens per batch (default: 4)
 * @param delayMs - Delay between batches in milliseconds (default: 150)
 * @returns Cleanup function to cancel pending operations
 */
export function generateProgressiveTokens(
    countPerCategory: number = 12,
    onBatch: ProgressiveCallback,
    batchSize: number = 4,
    delayMs: number = 150
): () => void {
    const timeouts: NodeJS.Timeout[] = [];
    const categories: TokenCategory[] = ['new-pairs', 'final-stretch', 'migrated'];

    // Stagger start time for each category
    const categoryOffsets: Record<TokenCategory, number> = {
        'new-pairs': 0,
        'final-stretch': 100,
        'migrated': 200,
    };

    categories.forEach((category) => {
        const totalBatches = Math.ceil(countPerCategory / batchSize);
        let generatedTokens: Token[] = [];

        for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
            const batchStart = batchIndex * batchSize;
            const batchEnd = Math.min(batchStart + batchSize, countPerCategory);
            const tokensInBatch = batchEnd - batchStart;
            const isLastBatch = batchIndex === totalBatches - 1;

            const delay = categoryOffsets[category] + (batchIndex * delayMs);

            const timeout = setTimeout(() => {
                const newTokens = Array.from({ length: tokensInBatch }, () =>
                    generateMockToken(category)
                );
                generatedTokens = [...generatedTokens, ...newTokens];
                onBatch(category, [...generatedTokens], isLastBatch);
            }, delay);

            timeouts.push(timeout);
        }
    });

    // Return cleanup function
    return () => {
        timeouts.forEach((timeout) => clearTimeout(timeout));
    };
}

/**
 * Generate a price update for a token
 */
export function generatePriceUpdate(token: Token): PriceUpdate {
    // Small random price change (±5%)
    const priceChange = 1 + (Math.random() - 0.5) * 0.1;
    const newPrice = token.price * priceChange;

    return {
        tokenId: token.id,
        price: newPrice,
        priceChange1m: generatePercentageChange(0.5),
        priceChange5m: generatePercentageChange(0.8),
        timestamp: Date.now(),
    };
}

type MessageHandler = (updates: PriceUpdate[]) => void;

/**
 * Mock WebSocket service for simulating real-time price updates
 */
class WebSocketMockService {
    private interval: NodeJS.Timeout | null = null;
    private tokens: Token[] = [];
    private handlers: Set<MessageHandler> = new Set();
    private _isConnected: boolean = false;
    private updateFrequency: number = 1500; // ms between updates

    /**
     * Start the mock service with initial tokens
     */
    start(allTokens: Token[]): void {
        this.tokens = allTokens;
        this._isConnected = true;

        // Generate price updates at regular intervals
        this.interval = setInterval(() => {
            if (!this._isConnected || this.tokens.length === 0) return;

            // Update 3-8 random tokens per tick
            const updateCount = Math.floor(Math.random() * 6) + 3;
            const updates: PriceUpdate[] = [];

            for (let i = 0; i < updateCount && i < this.tokens.length; i++) {
                const randomIndex = Math.floor(Math.random() * this.tokens.length);
                const token = this.tokens[randomIndex];
                updates.push(generatePriceUpdate(token));
            }

            // Notify all handlers
            this.handlers.forEach((handler) => handler(updates));
        }, this.updateFrequency);
    }

    /**
     * Stop the mock service
     */
    stop(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this._isConnected = false;
    }

    /**
     * Subscribe to price updates
     */
    subscribe(handler: MessageHandler): () => void {
        this.handlers.add(handler);
        return () => {
            this.handlers.delete(handler);
        };
    }

    /**
     * Update the token list
     */
    updateTokens(tokens: Token[]): void {
        this.tokens = tokens;
    }

    /**
     * Check connection status
     */
    get isConnected(): boolean {
        return this._isConnected;
    }

    /**
     * Set update frequency (for testing)
     */
    setUpdateFrequency(ms: number): void {
        this.updateFrequency = ms;
        if (this._isConnected) {
            this.stop();
            this.start(this.tokens);
        }
    }
}

// Singleton instance
export const webSocketMock = new WebSocketMockService();
