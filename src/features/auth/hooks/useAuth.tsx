
"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    login as loginService,
    signup as signupService,
    logout as logoutService,
    getCurrentUser,
} from "../services/auth.service";

import type {
    User,
    UserLogin,
    UserSignup,
} from "../types/auth.types";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (payload: UserLogin) => Promise<void>;
    signup: (payload: UserSignup) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = useCallback(async () => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            setUser(null);
            return;
        }

        try {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
        } catch {
            localStorage.removeItem("access_token");
            setUser(null);
        }
    }, []);

    // Initialize authentication only once.
    useEffect(() => {
        let cancelled = false;

        const initializeAuth = async () => {
            const token = localStorage.getItem("access_token");

            if (token) {
                try {
                    const currentUser = await getCurrentUser();

                    if (!cancelled) {
                        setUser(currentUser);
                    }
                } catch {
                    localStorage.removeItem("access_token");

                    if (!cancelled) {
                        setUser(null);
                    }
                }
            }

            if (!cancelled) {
                setIsLoading(false);
            }
        };

        void initializeAuth();

        return () => {
            cancelled = true;
        };
    }, []);

    const login = async (payload: UserLogin) => {
        await loginService(payload);
        await refreshUser();
    };

    const signup = async (payload: UserSignup) => {
        await signupService(payload);
    };

    const logout = async () => {
        try {
            await logoutService();
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: Boolean(user),
                login,
                signup,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}
