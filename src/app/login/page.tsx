"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");

  useEffect(() => {
    if (session) {
      router.push(callbackUrl);
    }
  }, [session, router, callbackUrl]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/40 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="panel max-w-md w-full">
        <div className="hd">
          <h3>Sign In</h3>
        </div>
        <div className="bd space-y-4 text-sm text-white/70">
          <p>Sign in with Discord to access your Black Mesa RP account.</p>
          {error && (
            <div className="rounded-[14px] border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-200">
              {error === "OAuthAccountNotLinked"
                ? "This email is already associated with another account."
                : "An error occurred during sign in. Please try again."}
            </div>
          )}
          <button
            onClick={() => signIn("discord", { callbackUrl })}
            className="btn primary w-full justify-center"
          >
            Continue with Discord
          </button>
          <p className="text-xs text-white/40">
            By signing in, you agree to our <a href="/terms" className="underline">Terms</a> and <a href="/privacy" className="underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
