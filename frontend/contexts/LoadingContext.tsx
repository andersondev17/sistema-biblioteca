// contexts/LoadingContext.tsx
"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";

interface LoadingContextType {
    isLoading: boolean;
    setLoading: (isLoading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
    isLoading: false,
    setLoading: () => { },
});

// contexts/LoadingContext.tsx
export const LoadingProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
            if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
            }
        };
    }, []);

    const setLoading = useCallback((loading: boolean) => {
        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
        }

        if (loading) {
            setIsLoading(true);
        } else {
            loadingTimeoutRef.current = setTimeout(() => {
                setIsLoading(prev => prev ? false : prev);
            }, 300);
        }
    }, []);

    return (
        <LoadingContext.Provider value={{ isLoading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);