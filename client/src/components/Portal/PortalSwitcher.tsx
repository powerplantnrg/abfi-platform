// File: client/src/components/Portal/PortalSwitcher.tsx
// Critical for A5: Multi-Portal Clarity heuristic

import React from 'react';
import { Link, useLocation } from 'wouter';
import { Tractor, Building2, Landmark, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Portal {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'green' | 'blue' | 'purple' | 'cyan';
  description: string;
  path: string;
  features: string[];
}

const PORTALS: Portal[] = [
  {
    id: 'grower',
    name: 'Grower Portal',
    icon: Tractor,
    color: 'green',
    description: 'For agricultural producers',
    path: '/grower',
    features: ['Register Feedstock', 'Track Carbon', 'Manage Contracts']
  },
  {
    id: 'developer',
    name: 'Developer Portal',
    icon: Building2,
    color: 'blue',
    description: 'For bioenergy project developers',
    path: '/developer',
    features: ['Supply Chain', 'Bankability', 'Risk Analysis']
  },
  {
    id: 'lender',
    name: 'Lender Portal',
    icon: Landmark,
    color: 'purple',
    description: 'For financial institutions',
    path: '/lender',
    features: ['Investment Monitoring', 'Covenant Tracking', 'Portfolio Risk']
  },
  {
    id: 'government',
    name: 'Government Portal',
    icon: Shield,
    color: 'cyan',
    description: 'For government agencies',
    path: '/government',
    features: ['Compliance', 'Grant Verification', 'Reporting']
  }
];

const colorClasses = {
  green: {
    active: 'bg-green-50 ring-1 ring-green-200',
    icon: 'text-green-600',
    border: 'border-green-200 bg-green-50/50',
    header: 'text-green-700'
  },
  blue: {
    active: 'bg-blue-50 ring-1 ring-blue-200',
    icon: 'text-blue-600',
    border: 'border-blue-200 bg-blue-50/50',
    header: 'text-blue-700'
  },
  purple: {
    active: 'bg-purple-50 ring-1 ring-purple-200',
    icon: 'text-purple-600',
    border: 'border-purple-200 bg-purple-50/50',
    header: 'text-purple-700'
  },
  cyan: {
    active: 'bg-cyan-50 ring-1 ring-cyan-200',
    icon: 'text-cyan-600',
    border: 'border-cyan-200 bg-cyan-50/50',
    header: 'text-cyan-700'
  }
};

interface PortalSwitcherProps {
  currentPortal?: string;
  onSwitch?: (portalId: string) => void;
  accessiblePortals?: string[];
}

export function PortalSwitcher({
  currentPortal,
  onSwitch,
  accessiblePortals
}: PortalSwitcherProps) {
  const [location] = useLocation();

  // Filter portals based on access (default to all if not specified)
  const availablePortals = accessiblePortals
    ? PORTALS.filter(p => accessiblePortals.includes(p.id))
    : PORTALS;

  if (availablePortals.length <= 1) {
    return null; // Don't show switcher if only one portal
  }

  return (
    <div className="border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="container py-3">
        <div className="flex items-center justify-between">
          <nav className="flex items-center gap-2" aria-label="Portal navigation">
            {availablePortals.map((portal) => {
              const Icon = portal.icon;
              const isActive = currentPortal === portal.id ||
                              location.startsWith(portal.path);
              const colors = colorClasses[portal.color];

              return (
                <Link
                  key={portal.id}
                  href={portal.path}
                  onClick={() => onSwitch?.(portal.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                    "hover:bg-gray-100 dark:hover:bg-gray-800",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                    isActive && colors.active
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive ? colors.icon : 'text-gray-500'
                  )} />
                  <span className={cn(
                    "text-sm font-medium",
                    isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                  )}>
                    {portal.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          <PortalFeaturePreview currentPortal={currentPortal} />
        </div>
      </div>
    </div>
  );
}

interface PortalFeaturePreviewProps {
  currentPortal?: string;
}

function PortalFeaturePreview({ currentPortal }: PortalFeaturePreviewProps) {
  const portal = PORTALS.find(p => p.id === currentPortal);
  if (!portal) return null;

  return (
    <div className="hidden lg:flex items-center gap-2" aria-label="Portal features">
      {portal.features.map((feature, idx) => (
        <span
          key={idx}
          className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full"
        >
          {feature}
        </span>
      ))}
    </div>
  );
}

interface PortalLayoutProps {
  portalId: string;
  children: React.ReactNode;
  showSwitcher?: boolean;
}

// Portal-specific branding wrapper
export function PortalLayout({ portalId, children, showSwitcher = true }: PortalLayoutProps) {
  const portal = PORTALS.find(p => p.id === portalId);
  const colors = portal ? colorClasses[portal.color] : colorClasses.blue;

  return (
    <div className={cn("min-h-screen", `portal-${portalId}`)}>
      {showSwitcher && <PortalSwitcher currentPortal={portalId} />}

      {/* Portal-specific header theming */}
      <header className={cn("border-b", colors.border)}>
        <div className="container py-6">
          <div className="flex items-center gap-4">
            {portal?.icon && (
              <div className={cn(
                "p-3 rounded-xl",
                colors.active
              )}>
                {React.createElement(portal.icon, {
                  className: cn("w-8 h-8", colors.icon)
                })}
              </div>
            )}
            <div>
              <h1 className={cn(
                "text-2xl font-bold",
                colors.header
              )}>
                {portal?.name}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {portal?.description}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="container py-8">
        {children}
      </main>
    </div>
  );
}

// Export portal data for use elsewhere
export { PORTALS, colorClasses };
export type { Portal };
