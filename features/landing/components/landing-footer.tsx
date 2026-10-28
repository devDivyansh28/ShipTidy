import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-zinc-900 bg-black py-12 px-4 sm:px-6 lg:px-8 text-zinc-500 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white tracking-tight">shiptidy</span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-400">AI Code Reviewer</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="#features" className="hover:text-zinc-300 transition-colors">
            Features
          </Link>
          <Link href="#preview" className="hover:text-zinc-300 transition-colors">
            Preview
          </Link>
          <Link href="#pricing" className="hover:text-zinc-300 transition-colors">
            Pricing
          </Link>
          <Link href="#faq" className="hover:text-zinc-300 transition-colors">
            FAQ
          </Link>
          <Link href="/dashboard" className="hover:text-zinc-300 transition-colors">
            Dashboard
          </Link>
        </div>

        <p>© {new Date().getFullYear()} ShipTidy. Automated AI code reviews for modern teams.</p>
      </div>
    </footer>
  );
}
