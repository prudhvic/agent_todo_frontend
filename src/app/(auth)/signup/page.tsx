'use client'
import { AuthCard } from "@/features/auth/components/auth-card";
import { SignupFooter, SignupHeader } from "@/features/auth/components/signup-form";
import { SignupForm } from "@/features/auth/components/signup-header";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { redirect } from "next/navigation";


export default function SignupPage() {
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
        <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
            <AuthCard>
                <SignupHeader />
                <SignupForm />
                <SignupFooter />
            </AuthCard>
        </main>
    );
}