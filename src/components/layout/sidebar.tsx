
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    CheckSquare,
    MessageSquare,
    LogOut,
} from "lucide-react";

import { useAuth } from "@/features/auth/hooks/useAuth";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "AI Chat", href: "/chat", icon: MessageSquare },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, user } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.replace("/login");
    };

    return (
        <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
            {/* Brand */}
            <div className="flex h-16 items-center border-b border-gray-100 px-6">
                <h1 className="text-lg font-semibold tracking-tight text-gray-900">
                    Todo AI
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-6">
                <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Workspace
                </p>

                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <Icon size={18} strokeWidth={1.8} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* User section */}

            {/* User section */}
            <div className="border-t border-gray-200 p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                        {user?.full_name?.charAt(0).toUpperCase() ?? "U"}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                            {user?.full_name ?? "User"}
                        </p>
                        <p className="text-xs text-gray-500">Signed in</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        title="Logout"
                        aria-label="Logout"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-red-600"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>

        </aside>
    );
}
