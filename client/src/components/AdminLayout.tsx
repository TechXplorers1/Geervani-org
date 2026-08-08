// client/src/components/AdminLayout.tsx

import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Home,
  LayoutDashboard,
  BookOpen,
  Users,
  Layers,
  LogOut,
  Heart,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

type AdminLayoutProps = {
  children: ReactNode;
};

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/messages", label: "Messages", icon: BookOpen },
  { href: "/admin/payments", label: "Payments", icon: Layers },
  { href: "/admin/programs", label: "Programs", icon: BookOpen },
  { href: "/admin/events", label: "Events", icon: Calendar },             // Added
  { href: "/admin/stories", label: "Stories", icon: Heart },
  { href: "/admin/blog", label: "Blog Posts", icon: BookOpen },
  { href: "/admin/about", label: "Team Members", icon: Users },
  { href: "/admin/trustees", label: "Trustees", icon: Users },             // Added
  { href: "/admin/projects", label: "Projects", icon: Layers },
  { href: "/admin/settings", label: "Settings", icon: BookOpen },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, navigate] = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (!confirmed) return;

    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-muted/10">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col border-r bg-[#0f172a] text-slate-100">
        <div className="px-6 py-4 border-b border-slate-800">
          <h1 className="font-heading font-bold text-xl">RSF Admin</h1>
          <p className="text-xs text-slate-400">Internal dashboard</p>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-sans text-left transition 
                    ${isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-slate-400 hover:bg-slate-800 hover:text-white"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-14 border-b flex items-center justify-between px-4 md:px-6 bg-white">
          <h2 className="font-heading font-semibold text-lg">Admin Dashboard</h2>
          <Link href="/">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">
              <Home className="h-4 w-4 mr-2" />
              View Website
            </Button>
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
