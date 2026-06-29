import {
  Coins,
  FileChartColumnIncreasing,
  Home,
  Search,
  Send,
  Notebook,
  NotebookPen,
  SquareKanban,
  Users,
  UsersRound,
  Clock10,
  BarChart3,
  Play,
  Settings2,
  PieChart,
  Landmark,
  ContactIcon,
  User2Icon,
  MonitorIcon,
  PaletteIcon,
} from "lucide-react";

export const userItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Apply for Leave",
    url: "/leave/apply",
    icon: Send,
  },
  {
    title: "My Leaves",
    url: "/leave/history",
    icon: Search,
  },
  {
    title: "Late Arrivals",
    url: "/late-arrival",
    icon: Clock10,
  },
  {
    title: "Medical Benefits",
    url: "/medical-benefits",
    icon: Coins,
  },
  {
    title: "Provident Fund",
    url: "/pf",
    icon: Landmark,
  },
  {
    title: "Policies",
    url: "/policies",
    icon: Notebook,
  },
];

export const managerItems = [
  {
    title: "Leave Requests",
    url: "/manager/requests",
    icon: SquareKanban,
  },
  {
    title: "Team Overview",
    url: "/manager/team",
    icon: Users,
  },
];

export const adminItems = [
  {
    title: "Users",
    url: "/admin/users",
    icon: UsersRound,
  },
  {
    title: "Leave Balances",
    url: "/admin/balances",
    icon: Coins,
  },
  {
    title: "Medical Benefits",
    url: "/admin/medical-benefits",
    icon: Coins,
  },
  {
    title: "Manage Medical Limits",
    url: "/admin/medical-limits",
    icon: NotebookPen,
  },
  {
    title: "Manage Leave",
    url: "/admin/leave-types",
    icon: FileChartColumnIncreasing,
  },
  {
    title: "Manage Policies",
    url: "/admin/policies",
    icon: NotebookPen,
  },
];

export const adminPFItems = [
  {
    title: "PF Settings",
    url: "/admin/pf/settings",
    icon: Settings2,
  },
  {
    title: "PF Summary",
    url: "/admin/pf/summary",
    icon: PieChart,
  },
  {
    title: "PF Processing",
    url: "/admin/pf/process",
    icon: Play,
  },
  {
    title: "PF Reports",
    url: "/admin/pf/reports",
    icon: BarChart3,
  },
];

export const accountItems = [
  {
    title: "My Account",
    url: "/account",
    icon: User2Icon,
  },
  {
    title: "Emergency Contacts",
    url: "/emergency-contacts",
    icon: ContactIcon,
  },
  {
    title: "Sessions",
    url: "/sessions",
    icon: MonitorIcon,
  },
  {
    title: "Appearance",
    url: "/appearance",
    icon: PaletteIcon,
  },
];
