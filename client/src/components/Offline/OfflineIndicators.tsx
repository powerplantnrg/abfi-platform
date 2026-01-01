// File: client/src/components/Offline/OfflineIndicators.tsx
// UI components for offline status indication

import React from 'react';
import { WifiOff, Wifi, RefreshCw, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectionStatusProps {
  isOnline: boolean;
  isLoading?: boolean;
  lastSyncTime?: Date | null;
  className?: string;
}

export function ConnectionStatus({
  isOnline,
  isLoading = false,
  lastSyncTime,
  className
}: ConnectionStatusProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div className={cn(
          "w-2.5 h-2.5 rounded-full transition-colors",
          isOnline ? 'bg-green-500' : 'bg-red-500'
        )} />
        {isLoading && (
          <div className="absolute inset-0 animate-ping">
            <div className={cn(
              "w-2.5 h-2.5 rounded-full opacity-75",
              isOnline ? 'bg-green-500' : 'bg-red-500'
            )} />
          </div>
        )}
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {isLoading ? 'Syncing...' : isOnline ? 'Online' : 'Offline'}
      </span>
      {lastSyncTime && isOnline && !isLoading && (
        <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatRelativeTime(lastSyncTime)}
        </span>
      )}
    </div>
  );
}

interface OfflineBannerProps {
  isOffline: boolean;
  lastSyncTime?: Date | null;
  onRetry?: () => void;
  className?: string;
}

export function OfflineBanner({
  isOffline,
  lastSyncTime,
  onRetry,
  className
}: OfflineBannerProps) {
  if (!isOffline) return null;

  return (
    <div className={cn(
      "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4",
      className
    )}>
      <div className="flex items-start gap-3">
        <WifiOff className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-amber-900 dark:text-amber-100">
            Offline Mode
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
            You're viewing cached data from your last online session.
            Changes will sync automatically when connection is restored.
          </p>
          {lastSyncTime && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Last synced: {lastSyncTime.toLocaleString()}
            </p>
          )}
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-800/50 rounded-md hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
            aria-label="Retry connection"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

interface SyncStatusBadgeProps {
  status: 'synced' | 'offline' | 'syncing' | 'error';
  className?: string;
}

export function SyncStatusBadge({ status, className }: SyncStatusBadgeProps) {
  const configs = {
    synced: {
      icon: Wifi,
      label: 'Synced',
      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    },
    offline: {
      icon: WifiOff,
      label: 'Offline',
      className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
    },
    syncing: {
      icon: RefreshCw,
      label: 'Syncing',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    },
    error: {
      icon: AlertCircle,
      label: 'Sync Error',
      className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    }
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
      config.className,
      className
    )}>
      <Icon className={cn(
        "w-3.5 h-3.5",
        status === 'syncing' && 'animate-spin'
      )} />
      {config.label}
    </span>
  );
}

interface OfflineToastProps {
  isVisible: boolean;
  onDismiss?: () => void;
}

export function OfflineToast({ isVisible, onDismiss }: OfflineToastProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="flex items-center gap-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-3 rounded-lg shadow-lg">
        <WifiOff className="w-5 h-5 text-amber-400 dark:text-amber-600" />
        <div>
          <p className="font-medium text-sm">You're offline</p>
          <p className="text-xs text-gray-300 dark:text-gray-600">
            Some features may be limited
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-2 text-gray-400 hover:text-white dark:hover:text-gray-900"
            aria-label="Dismiss"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
}

// Utility function for relative time formatting
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  return date.toLocaleDateString();
}

export default {
  ConnectionStatus,
  OfflineBanner,
  SyncStatusBadge,
  OfflineToast
};
