import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Layers,
  Sparkles,
  Tag,
  Wallet,
  Pencil,
  Package,
  Users,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  ShieldCheck,
  Rocket,
  Shield,
  Headphones,
} from "lucide-react";
import heroImage from "../../assets/auth.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Log in to SwagStore" },
      { name: "description", content: "Corporate swag & gifting on autopilot. Design, manage and deliver branded merchandise your team will love." },
      { property: "og:title", content: "Log in to SwagStore" },
      { property: "og:description", content: "Corporate swag & gifting on autopilot." },
    ],
  }),
  component: Index,
});

function Index() {
  const [showPassword, setShowPassword] = useState(false);

  const features = [
    { icon: Tag, label: "Branded stores" },
    { icon: Wallet, label: "Points wallets" },
    { icon: Pencil, label: "Swag designer" },
    { icon: Package, label: "Kits at scale" },
    { icon: Users, label: "HRIS sync" },
  ];

  const trustLogos = [
    { name: "Spotify", slug: "spotify", color: "1ED760" },
    { name: "Notion", slug: "notion", color: "000000" },
    { name: "Webflow", slug: "webflow", color: "146EF5" },
    { name: "Ramp", slug: "ramp", color: "0A1F1C" },
    { name: "Deel", slug: "deel", color: "1453FF" },
  ];

  const perks = [
    { icon: Rocket, title: "Launch in minutes", desc: "Go from idea to live store in minutes." },
    { icon: Shield, title: "Secure & reliable", desc: "Enterprise-grade security you can count on." },
    { icon: Headphones, title: "We're here to help", desc: "Real humans. Real fast support." },
  ];

  return (
    <div className="min-h-screen bg-[#f7faf8] text-[#0f1a14]">
      {/* Top nav */}
      <header className="flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0f4d2e] text-white">
            <Layers className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-[#0f4d2e]">SwagStore</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-[#0f1a14] sm:inline">New here?</span>
          <button className="rounded-lg border border-[#0f4d2e] px-4 py-2 text-sm font-medium text-[#0f4d2e] transition hover:bg-[#0f4d2e] hover:text-white">
            Create an account
          </button>
        </div>
      </header>

      {/* Main grid */}
      <main className="grid grid-cols-1 gap-8 px-6 pb-10 md:px-12 lg:grid-cols-2 lg:gap-12">
        {/* Left column */}
        <section className="flex flex-col">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#dff0e4] px-4 py-2 text-sm text-[#0f4d2e]">
            <Sparkles className="h-4 w-4" />
            Everything your team needs. One smart workspace.
          </div>

          <h1 className="mt-8 text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            Corporate swag &<br />
            gifting, <span className="text-[#0f4d2e]">on autopilot.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg text-[#3a463f]">
            Design, manage and deliver branded merchandise that your team will love.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {features.map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-2 rounded-xl border border-[#e5ede8] bg-white/80 px-4 py-3 text-sm font-medium backdrop-blur-sm"
              >
                <f.icon className="h-4 w-4 text-[#0f4d2e]" />
                {f.label}
              </div>
            ))}
          </div>

          <div className="relative mt-4 flex-1 overflow-hidden rounded-3xl">
            <img
              src={heroImage}
              alt="Branded Shelf Merch apparel and accessories"
              className="w-full max-w-3xl"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[#e5ede8] pt-6">
            <div className="flex items-center gap-2 text-sm text-[#3a463f]">
              <ShieldCheck className="h-4 w-4 text-[#0f4d2e]" />
              Trusted by leading teams worldwide
            </div>
            {trustLogos.map((l) => (
              <img
                key={l.slug}
                src={`https://cdn.simpleicons.org/${l.slug}/${l.color}`}
                alt={l.name}
                className="h-5 w-auto opacity-70"
              />
            ))}
          </div>
        </section>

        {/* Right column - auth card */}
        <section className="rounded-3xl bg-white p-8 shadow-sm md:p-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf2ec]">
            <Lock className="h-5 w-5 text-[#0f4d2e]" />
          </div>

          <p className="mt-6 text-sm font-medium text-[#0f4d2e]">Welcome back 👋</p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight">Log in to SwagStore</h2>
          <p className="mt-2 text-sm text-[#6b7a70]">Pick up where your team left off.</p>

          <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-[#0f1a14]">Work email</label>
              <div className="relative mt-2">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7a70]" />
                <input
                  type="email"
                  placeholder="hr@rubix.net"
                  className="w-full rounded-lg border border-[#e5ede8] bg-[#fafcfb] py-3 pl-10 pr-3 text-sm outline-none transition focus:border-[#0f4d2e]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0f1a14]">Password</label>
              <div className="relative mt-2">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7a70]" />
                <input
                  type={showPassword ? "text" : "password"}
                  defaultValue="passwordtest"
                  className="w-full rounded-lg border border-[#e5ede8] bg-[#fafcfb] py-3 pl-10 pr-10 text-sm outline-none transition focus:border-[#0f4d2e]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7a70] hover:text-[#0f4d2e]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-2 text-right">
                <a href="#" className="text-sm font-medium text-[#0f4d2e] underline">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0f4d2e] py-3.5 text-sm font-semibold text-white transition hover:bg-[#0a3a22]"
            >
              Log in <ChevronRight className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-[#e5ede8]" />
              <span className="text-xs font-medium text-[#6b7a70]">OR</span>
              <div className="h-px flex-1 bg-[#e5ede8]" />
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-[#e5ede8] bg-white py-3 text-sm font-medium transition hover:bg-[#f7faf8]"
            >
              <svg className="h-5 w-5" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2C40.9 35.3 44 30 44 24c0-1.3-.1-2.3-.4-3.5z" />
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-sm text-[#6b7a70]">
              New here?{" "}
              <a href="#" className="font-medium text-[#0f4d2e] underline">
                Create an account
              </a>
            </p>
          </form>

          <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl bg-[#f7efe1] p-5">
            {perks.map((p) => (
              <div key={p.title} className="text-center">
                <p.icon className="mx-auto h-5 w-5 text-[#0f4d2e]" />
                <p className="mt-2 text-xs font-semibold">{p.title}</p>
                <p className="mt-1 text-[11px] leading-tight text-[#6b7a70]">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
