import Link from "next/link";

export function LoginFooter() {
    return (
        <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
                Sign up
            </Link>
        </p>
    );
}