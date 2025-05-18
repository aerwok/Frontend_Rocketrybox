import { useState, useEffect } from 'react';
import { adminApi } from '../services/api/admin';
import { MenuItem } from '../types/api';
import { LayoutDashboard, UsersIcon, HeartHandshakeIcon, PackageIcon, ClipboardListIcon, SettingsIcon, AlertTriangleIcon, TruckIcon, MessageSquare, AlertCircle, WalletIcon } from "lucide-react";
import Icons from "../components/shared/icons";

// Define the hook's return type
interface UseSidebarMenuReturn {
  menuItems: MenuItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing sidebar menu items
 * @returns {UseSidebarMenuReturn} Object containing menu items, loading state, error state, and refetch function
 */
export const useSidebarMenu = (): UseSidebarMenuReturn => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Uncomment when API is ready
      // const items = await adminApi.getMenuItems();
      // setMenuItems(items);

      // Temporary static menu items until API is ready
      const staticMenuItems: MenuItem[] = [
        {
          icon: LayoutDashboard,
          to: "/admin/dashboard",
          label: "Dashboard",
          permissions: ["view_dashboard"]
        },
        {
          icon: UsersIcon,
          to: "/admin/dashboard/users",
          label: "Users",
          permissions: ["view_users"]
        },
        {
          icon: Icons.team,
          to: "/admin/dashboard/teams",
          label: "Teams",
          permissions: ["view_teams"]
        },
        {
          icon: HeartHandshakeIcon,
          to: "/admin/dashboard/partners",
          label: "Partners",
          permissions: ["view_partners"]
        },
        {
          icon: PackageIcon,
          to: "/admin/dashboard/orders",
          label: "Orders",
          permissions: ["view_orders"]
        },
        {
          icon: TruckIcon,
          to: "/admin/dashboard/shipments",
          label: "Shipments",
          permissions: ["view_shipments"]
        },
        {
          icon: MessageSquare,
          to: "/admin/dashboard/tickets",
          label: "Tickets",
          permissions: ["view_tickets"]
        },
        {
          icon: AlertCircle,
          to: "/admin/dashboard/ndr",
          label: "NDR",
          permissions: ["view_ndr"]
        },
        {
          icon: WalletIcon,
          to: "/admin/dashboard/billing",
          label: "Billing",
          permissions: ["view_billing"]
        },
        {
          icon: ClipboardListIcon,
          to: "/admin/dashboard/reports",
          label: "Reports",
          permissions: ["view_reports"]
        },
        {
          icon: AlertTriangleIcon,
          to: "/admin/dashboard/escalation",
          label: "Escalation",
          permissions: ["view_escalation"]
        },
        {
          icon: SettingsIcon,
          to: "/admin/dashboard/settings",
          label: "Settings",
          permissions: ["view_settings"]
        }
      ];

      setMenuItems(staticMenuItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching menu items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return {
    menuItems,
    loading,
    error,
    refetch: fetchMenuItems,
  };
}; 