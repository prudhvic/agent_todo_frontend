
"use client";

import { AuthCard } from "@/features/auth/components/auth-card";
import { LoginHeader } from "@/features/auth/components/login-header";
import { LoginForm } from "@/features/auth/components/login-form";
import { LoginFooter } from "@/features/auth/components/login-footer";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <AuthCard>
        <div className="space-y-6">
          <LoginHeader />
          <LoginForm />
          <LoginFooter />
        </div>
      </AuthCard>
    </div>
  );
}
