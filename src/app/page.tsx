
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between border-b border-gray-100 px-6">
        <Link href="/" className="text-lg font-semibold">
          Todo AI
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link href="/login" className="text-gray-600 hover:text-black">
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
          >
            Sign up
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-28">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Manage your tasks.
            <br />
            Get more done.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-gray-500">
            Keep your tasks organized and use AI to manage your everyday work
            through simple conversations.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <Link
              href="/signup"
              className="rounded-md bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-700"
            >
              Get started
            </Link>

            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-black"
            >
              Sign in →
            </Link>
          </div>
        </div>

        <div className="mt-24 border-t border-gray-100 pt-8">
          <h2 className="text-sm font-semibold text-gray-900">
            Everything you need to stay organized
          </h2>

          <div className="mt-6 grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-medium">Task management</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Create, update, and track your daily tasks.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium">AI assistant</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Manage tasks by describing what you need.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium">You stay in control</h3>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Review important changes before they happen.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
