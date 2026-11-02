import {
  CalendarClock,
  Clock,
  Bike,
  Truck,
  Users,
  Landmark,
  BarChart3,
  Megaphone,
  Wrench,
  ChefHat,
  LayoutDashboard,
  ClipboardList,
  LayoutGrid,
  Package,
  Settings,
  ShoppingCart,
  UsersRound,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

export type NavGroup = "service" | "kitchen" | "people" | "business";

export interface NavItem {
  labelKey: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
  /** Sidebar section; NAV_GROUPS decides the order sections appear in. */
  group?: NavGroup;
}

export const NAV_GROUPS: { id: NavGroup; labelKey: string }[] = [
  { id: "service", labelKey: "navGroup.service" },
  { id: "kitchen", labelKey: "navGroup.kitchen" },
  { id: "people", labelKey: "navGroup.people" },
  { id: "business", labelKey: "navGroup.business" },
];

export const NAV_ITEMS: NavItem[] = [
  // Service — the floor, minute to minute
  { labelKey: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "dashboard.sales.view", group: "service" },
  { labelKey: "nav.pos", href: "/pos", icon: ShoppingCart, permission: "orders.create", group: "service" },
  { labelKey: "nav.orders", href: "/orders", icon: ClipboardList, permission: "orders.create", group: "service" },
  { labelKey: "nav.tables", href: "/tables", icon: LayoutGrid, permission: "tables.view", group: "service" },
  { labelKey: "nav.reservations", href: "/reservations", icon: CalendarClock, permission: "reservations.manage", group: "service" },
  { labelKey: "nav.myDeliveries", href: "/my-deliveries", icon: Bike, permission: "delivery.rider", group: "service" },
  { labelKey: "nav.delivery", href: "/delivery", icon: Truck, permission: "delivery.manage", group: "service" },
  // Kitchen & stock
  { labelKey: "nav.kds", href: "/kds", icon: ChefHat, permission: "kds.manage", group: "kitchen" },
  { labelKey: "nav.menu", href: "/menu", icon: UtensilsCrossed, permission: "menu.view", group: "kitchen" },
  { labelKey: "nav.inventory", href: "/inventory", icon: Package, permission: "inventory.manage", group: "kitchen" },
  // Guests & team
  { labelKey: "nav.customers", href: "/customers", icon: UsersRound, permission: "customers.manage", group: "people" },
  { labelKey: "nav.team", href: "/team", icon: Users, permission: "staff.manage", group: "people" },
  { labelKey: "nav.attendance", href: "/attendance", icon: Clock, group: "people" },
  // Business
  { labelKey: "nav.reports", href: "/reports", icon: BarChart3, permission: "reports.access", group: "business" },
  { labelKey: "nav.accounting", href: "/accounting", icon: Landmark, permission: "accounting.manage", group: "business" },
  { labelKey: "nav.marketing", href: "/marketing", icon: Megaphone, permission: "marketing.manage", group: "business" },
  { labelKey: "nav.operations", href: "/operations", icon: Wrench, permission: "operations.manage", group: "business" },
  { labelKey: "nav.settings", href: "/settings", icon: Settings, permission: "settings.manage", group: "business" },
];
