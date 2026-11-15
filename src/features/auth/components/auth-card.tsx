import type { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm">
      {children}
    </div>
  );
}