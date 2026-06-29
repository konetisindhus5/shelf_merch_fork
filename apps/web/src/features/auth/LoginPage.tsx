import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ChevronRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { login, isPlatformUser } from "@/services/api-bridge";
import {
  AuthDivider,
  AuthField,
  AuthLayout,
  GoogleSignInButton,
  inputClassName,
  inputWithToggleClassName,
} from "./AuthLayout";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("hr@rubix.net");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter email and password");
      return;
    }
    setBusy(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
      if (isPlatformUser(user)) {
        navigate({ to: "/platform/dashboard" });
      } else {
        navigate({ to: "/app/orders" });
      }
    } catch (err) {
      setBusy(false);
      toast.error(err instanceof Error ? err.message : "Login failed");
    }
  }

  return (
    <AuthLayout
      headerHint="New here?"
      headerActionLabel="Create an account"
      headerActionTo="/signup"
      cardIcon={Lock}
      eyebrow="Welcome back 👋"
      title="Log in to SwagStore"
      subtitle="Pick up where your team left off."
    >
      <form className="mt-8 space-y-5" onSubmit={submit}>
        <AuthField label="Work email" icon={Mail}>
          <input
            type="email"
            placeholder="hr@rubix.net"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClassName}
            autoFocus
          />
        </AuthField>

        <div>
          <AuthField label="Password" icon={Lock}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputWithToggleClassName}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7a70] hover:text-[#0f4d2e]"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </AuthField>
          <div className="mt-2 text-right">
            <button
              type="button"
              className="text-sm font-medium text-[#0f4d2e] underline"
              onClick={() => toast("Reset link sent")}
            >
              Forgot password?
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0f4d2e] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0a3a22] disabled:opacity-60"
        >
          {busy ? "Signing you in…" : "Log in"} {!busy && <ChevronRight className="h-4 w-4" />}
        </button>

        <AuthDivider />
        <GoogleSignInButton onClick={() => toast("Google sign-in coming soon")} />

        <p className="text-center text-sm text-[#6b7a70]">
          New here?{" "}
          <Link to="/signup" className="font-medium text-[#0f4d2e] underline">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
