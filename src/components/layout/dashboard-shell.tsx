
import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";

export function DashboardShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="min-w-0 flex-1 overflow-y-auto bg-background p-6">
        {children}
      </main>
    </div>
  );
}
