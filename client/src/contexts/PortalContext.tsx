import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useLocation } from "wouter";
import { useUserRole } from "./UserRoleContext";
import {
  type Portal,
  type PortalConfig,
  PORTAL_CONFIGS,
  getAvailablePortals,
  getDefaultPortal,
  detectPortalFromPath,
  filterNavItemsByRole,
} from "@/config/navigation";

const STORAGE_KEY = "abfi-current-portal";
const SIDEBAR_COLLAPSED_KEY = "abfi-sidebar-collapsed";

interface PortalContextValue {
  // Portal state
  currentPortal: Portal;
  setPortal: (portal: Portal) => void;
  portalConfig: PortalConfig;
  availablePortals: Portal[];
  canAccessPortal: (portal: Portal) => boolean;

  // Sidebar state
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;

  // Mobile state
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Navigation helpers
  navigateToPortal: (portal: Portal) => void;
  getFilteredPrimaryActions: () => PortalConfig["primaryActions"];
  getFilteredSecondaryActions: () => PortalConfig["secondaryActions"];
  getFilteredQuickActions: () => PortalConfig["quickActions"];
}

const PortalContext = createContext<PortalContextValue | undefined>(undefined);

export function PortalProvider({ children }: { children: ReactNode }) {
  const { role } = useUserRole();
  const [location, setLocation] = useLocation();

  // Available portals based on role
  const availablePortals = useMemo(() => getAvailablePortals(role), [role]);

  // Initialize portal from URL, localStorage, or default
  const [currentPortal, setCurrentPortalState] = useState<Portal>(() => {
    // First, try to detect from current URL
    const urlPortal = detectPortalFromPath(location);
    if (urlPortal && availablePortals.includes(urlPortal)) {
      return urlPortal;
    }

    // Then try localStorage
    const stored = localStorage.getItem(STORAGE_KEY) as Portal | null;
    if (stored && availablePortals.includes(stored)) {
      return stored;
    }

    // Fall back to default for role
    return getDefaultPortal(role);
  });

  // Sidebar collapsed state with persistence
  const [sidebarCollapsed, setSidebarCollapsedState] = useState<boolean>(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return stored === "true";
  });

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Current portal configuration
  const portalConfig = useMemo(
    () => PORTAL_CONFIGS[currentPortal],
    [currentPortal]
  );

  // Check if user can access a portal
  const canAccessPortal = useCallback(
    (portal: Portal) => availablePortals.includes(portal),
    [availablePortals]
  );

  // Set portal with persistence
  const setPortal = useCallback((portal: Portal) => {
    if (availablePortals.includes(portal)) {
      setCurrentPortalState(portal);
      localStorage.setItem(STORAGE_KEY, portal);
    }
  }, [availablePortals]);

  // Set sidebar collapsed with persistence
  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    setSidebarCollapsedState(collapsed);
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
  }, []);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(!sidebarCollapsed);
  }, [sidebarCollapsed, setSidebarCollapsed]);

  // Navigate to portal dashboard
  const navigateToPortal = useCallback((portal: Portal) => {
    if (!canAccessPortal(portal)) return;

    setPortal(portal);
    const config = PORTAL_CONFIGS[portal];
    const dashboardAction = config.primaryActions.find(
      (action) => action.id.includes("dashboard")
    );
    if (dashboardAction) {
      setLocation(dashboardAction.href);
    }
  }, [canAccessPortal, setPortal, setLocation]);

  // Filtered navigation items based on role
  const getFilteredPrimaryActions = useCallback(() => {
    return filterNavItemsByRole(portalConfig.primaryActions, role);
  }, [portalConfig, role]);

  const getFilteredSecondaryActions = useCallback(() => {
    return filterNavItemsByRole(portalConfig.secondaryActions, role);
  }, [portalConfig, role]);

  const getFilteredQuickActions = useCallback(() => {
    return filterNavItemsByRole(portalConfig.quickActions, role);
  }, [portalConfig, role]);

  // Sync portal with URL changes
  useEffect(() => {
    const urlPortal = detectPortalFromPath(location);
    if (urlPortal && urlPortal !== currentPortal && canAccessPortal(urlPortal)) {
      setCurrentPortalState(urlPortal);
      localStorage.setItem(STORAGE_KEY, urlPortal);
    }
  }, [location, currentPortal, canAccessPortal]);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Ensure current portal is valid when role changes
  useEffect(() => {
    if (!availablePortals.includes(currentPortal)) {
      const newPortal = getDefaultPortal(role);
      setCurrentPortalState(newPortal);
      localStorage.setItem(STORAGE_KEY, newPortal);
    }
  }, [role, availablePortals, currentPortal]);

  const value: PortalContextValue = useMemo(
    () => ({
      currentPortal,
      setPortal,
      portalConfig,
      availablePortals,
      canAccessPortal,
      sidebarCollapsed,
      setSidebarCollapsed,
      toggleSidebar,
      mobileMenuOpen,
      setMobileMenuOpen,
      navigateToPortal,
      getFilteredPrimaryActions,
      getFilteredSecondaryActions,
      getFilteredQuickActions,
    }),
    [
      currentPortal,
      setPortal,
      portalConfig,
      availablePortals,
      canAccessPortal,
      sidebarCollapsed,
      setSidebarCollapsed,
      toggleSidebar,
      mobileMenuOpen,
      navigateToPortal,
      getFilteredPrimaryActions,
      getFilteredSecondaryActions,
      getFilteredQuickActions,
    ]
  );

  return (
    <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
  );
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (context === undefined) {
    throw new Error("usePortal must be used within a PortalProvider");
  }
  return context;
}

// Portal-based conditional rendering
interface PortalGuardProps {
  children: ReactNode;
  portal: Portal | Portal[];
  fallback?: ReactNode;
}

export function PortalOnly({ children, portal, fallback = null }: PortalGuardProps) {
  const { currentPortal } = usePortal();
  const portals = Array.isArray(portal) ? portal : [portal];
  return portals.includes(currentPortal) ? <>{children}</> : <>{fallback}</>;
}
