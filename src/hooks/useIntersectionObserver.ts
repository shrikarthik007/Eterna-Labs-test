import { useEffect, useRef, useState, useCallback } from 'react';

interface IntersectionObserverOptions {
    root?: Element | null;
    rootMargin?: string;
    threshold?: number | number[];
    triggerOnce?: boolean;
}

interface IntersectionObserverResult {
    ref: (node: Element | null) => void;
    isIntersecting: boolean;
    entry: IntersectionObserverEntry | null;
}

/**
 * Custom hook for IntersectionObserver API
 * @param options - IntersectionObserver options
 * @returns Object with ref callback, isIntersecting state, and entry
 */
export function useIntersectionObserver(
    options: IntersectionObserverOptions = {}
): IntersectionObserverResult {
    const { root = null, rootMargin = '0px', threshold = 0, triggerOnce = false } = options;

    const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [node, setNode] = useState<Element | null>(null);
    const hasTriggered = useRef(false);

    // Ref callback to set the target node
    const ref = useCallback((newNode: Element | null) => {
        setNode(newNode);
    }, []);

    useEffect(() => {
        // Skip if no node, not supported, or already triggered (when triggerOnce)
        if (!node || typeof IntersectionObserver === 'undefined') return;
        if (triggerOnce && hasTriggered.current) return;

        const observer = new IntersectionObserver(
            ([observerEntry]) => {
                setEntry(observerEntry);
                setIsIntersecting(observerEntry.isIntersecting);

                // If triggerOnce is enabled and element is intersecting, disconnect
                if (triggerOnce && observerEntry.isIntersecting) {
                    hasTriggered.current = true;
                    observer.disconnect();
                }
            },
            { root, rootMargin, threshold }
        );

        observer.observe(node);

        return () => {
            observer.disconnect();
        };
    }, [node, root, rootMargin, threshold, triggerOnce]);

    return { ref, isIntersecting, entry };
}
