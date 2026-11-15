import Link from "next/link";

export function SignupHeader() {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold tracking-tight">
        Create your account
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        Start managing your tasks with AI.
      </p>
    </div>
  );
}

export function SignupFooter() {
  return (
    <p className="mt-6 text-center text-sm text-muted-foreground">
      Already have an account?{" "}
      <Link
        href="/login"
        className="font-semibold text-foreground hover:underline"
      >
        Sign in
      </Link>
    </p>
  );
}