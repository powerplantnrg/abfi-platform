// File: client/src/hooks/useOfflineData.ts
// Critical for A4: Offline Capability (rural users)

import { useEffect, useState, useCallback } from 'react';
import { useQuery, useQueryClient, type QueryKey, type UseQueryOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

interface OfflineDataOptions<TData> extends Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'> {
  allowOffline?: boolean;
  offlineFallback?: TData;
  syncOnReconnect?: boolean;
}

interface OfflineDataResult<TData> {
  data: TData | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isOnline: boolean;
  isOffline: boolean;
  syncStatus: 'synced' | 'offline' | 'syncing';
  lastSyncTime: Date | null;
  refetch: () => void;
}

export function useOfflineData<TData>(
  queryKey: QueryKey,
  fetchFn: () => Promise<TData>,
  options: OfflineDataOptions<TData> = {}
): OfflineDataResult<TData> {
  const queryClient = useQueryClient();
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const {
    allowOffline = true,
    offlineFallback,
    syncOnReconnect = true,
    ...queryOptions
  } = options;

  // Monitor connection status
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = async () => {
      setIsOnline(true);
      setIsSyncing(true);

      toast.success('Back Online', {
        description: 'Syncing your data...',
        icon: <Wifi className="w-4 h-4" />,
        duration: 3000,
      });

      // Resume paused mutations
      try {
        await queryClient.resumePausedMutations();

        // Refetch stale queries if syncOnReconnect is enabled
        if (syncOnReconnect) {
          await queryClient.invalidateQueries({ queryKey });
        }

        setLastSyncTime(new Date());
        toast.success('Sync Complete', {
          description: 'All data is up to date',
          duration: 2000,
        });
      } catch (error) {
        toast.error('Sync Failed', {
          description: 'Some changes may not have been saved',
        });
      } finally {
        setIsSyncing(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('Offline Mode Activated', {
        description: 'Using cached data. Sync will resume when connection is restored.',
        icon: <WifiOff className="w-4 h-4" />,
        duration: 5000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [queryClient, queryKey, syncOnReconnect]);

  // Configure query with offline support
  const query = useQuery({
    queryKey,
    queryFn: fetchFn,
    staleTime: isOnline ? (queryOptions.staleTime ?? 1000 * 60 * 5) : Infinity, // 5 min when online, infinite when offline
    gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)
    retry: isOnline ? 3 : 0, // Don't retry when offline
    enabled: isOnline || allowOffline,
    placeholderData: offlineFallback,
    ...queryOptions,
    meta: {
      offline: !isOnline,
      ...queryOptions.meta,
    },
  });

  // Prefetch data when online for offline use
  useEffect(() => {
    if (isOnline && allowOffline) {
      queryClient.prefetchQuery({
        queryKey,
        queryFn: fetchFn,
        staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
      });
    }
  }, [isOnline, queryKey, queryClient, fetchFn, allowOffline]);

  // Track successful syncs
  useEffect(() => {
    if (query.isSuccess && isOnline && !query.isFetching) {
      setLastSyncTime(new Date());
    }
  }, [query.isSuccess, query.isFetching, isOnline]);

  const refetch = useCallback(() => {
    if (isOnline) {
      query.refetch();
    } else {
      toast.warning('Cannot refresh while offline', {
        description: 'Connect to the internet to get the latest data',
        icon: <WifiOff className="w-4 h-4" />,
      });
    }
  }, [isOnline, query]);

  const syncStatus = isSyncing ? 'syncing' : isOnline ? 'synced' : 'offline';

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isOnline,
    isOffline: !isOnline,
    syncStatus,
    lastSyncTime,
    refetch,
  };
}

// Hook for offline form drafts
export function useOfflineFormDraft<T extends Record<string, unknown>>(
  formId: string,
  initialData?: T
) {
  const storageKey = `form-draft-${formId}`;

  const [draft, setDraft] = useState<T | null>(() => {
    if (typeof window === 'undefined') return initialData ?? null;

    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : (initialData ?? null);
    } catch {
      return initialData ?? null;
    }
  });

  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveDraft = useCallback((data: T) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      setDraft(data);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast.error('Failed to save draft', {
        description: 'Your changes may not be saved offline',
      });
    }
  }, [storageKey]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      setDraft(null);
      setLastSaved(null);
    } catch (error) {
      console.error('Failed to clear draft:', error);
    }
  }, [storageKey]);

  const hasDraft = draft !== null;

  return {
    draft,
    saveDraft,
    clearDraft,
    hasDraft,
    lastSaved,
  };
}

export default useOfflineData;
