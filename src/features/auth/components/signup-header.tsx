"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getApiError } from "@/lib/api/error";

import {
    signupSchema,
    type SignupFormValues,
} from "@/features/auth/types/signup.schema";
import { Label } from "@/components/ui/label";

export function SignupForm() {
    const router = useRouter();
    const { signup } = useAuth();

    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            full_name: "",
            email: "",
            password: "",
            confirm_password: "",
        },
    });

    const onSubmit = async (values: SignupFormValues) => {
        setServerError("");

        try {
            await signup({
                full_name: values.full_name,
                email: values.email,
                password: values.password,
            });

            router.replace("/login");
        } catch (error) {
            setServerError(getApiError(error));
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
                <Label htmlFor="full_name">Full name</Label>
                <Input
                    id="full_name"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    {...register("full_name")}
                />
                {errors.full_name && (
                    <p className="text-sm text-destructive">
                        {errors.full_name.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...register("email")}
                />
                {errors.email && (
                    <p className="text-sm text-destructive">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    {...register("password")}
                />
                {errors.password && (
                    <p className="text-sm text-destructive">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm password</Label>
                <Input
                    id="confirm_password"
                    type="password"
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    {...register("confirm_password")}
                />
                {errors.confirm_password && (
                    <p className="text-sm text-destructive">
                        {errors.confirm_password.message}
                    </p>
                )}
            </div>

            {serverError && (
                <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {serverError}
                </p>
            )}

            <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
        </form>
    );
}