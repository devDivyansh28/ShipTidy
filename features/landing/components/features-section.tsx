import {
  LightningIcon,
  CpuIcon,
  ShieldCheckIcon,
  GitBranchIcon,
  ClockIcon,
  DatabaseIcon,
} from "@phosphor-icons/react/dist/ssr";

const FEATURES = [
  {
    icon: LightningIcon,
    title: "Instant Webhook Triggers",
    description:
      "Reviews trigger automatically on opened, updated, and reopened pull requests. No manual commands or slash prompts needed.",
    badge: "Real-time",
  },
  {
    icon: DatabaseIcon,
    title: "Pinecone Vector Context",
    description:
      "Diff chunks are embedded and cross-referenced with your entire codebase. The AI spots breaking changes outside the immediate diff.",
    badge: "Vector RAG",
  },
  {
    icon: ShieldCheckIcon,
    title: "6 Quality Pillars",
    description:
      "Structured feedback evaluated across correctness, security vulnerabilities, performance bottlenecks, reliability, and maintainability.",
    badge: "Deep Analysis",
  },
  {
    icon: GitBranchIcon,
    title: "1-Click GitHub App Setup",
    description:
      "Connect ShipTidy to any personal account or organization in 30 seconds. No brittle CI/CD YAML configurations to write or maintain.",
    badge: "Zero Config",
  },
  {
    icon: CpuIcon,
    title: "Next-Gen AI Models",
    description:
      "Powered by the Vercel AI SDK and OpenRouter, utilizing optimized models fine-tuned for syntax reasoning and developer workflows.",
    badge: "Vercel AI SDK",
  },
  {
    icon: ClockIcon,
    title: "Async Inngest Pipelines",
    description:
      "Multi-file diffs and large repository indexing run smoothly on background workers with zero serverless timeout limits.",
    badge: "Reliable",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 max-w-6xl mx-auto border-t border-zinc-900">
      <div className="text-center mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
          Engineered for Clean Code & Rapid Shipping
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
          Everything your engineering team needs to catch subtle bugs, enforce best practices, and accelerate PR approvals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              className="group relative p-6 rounded-xl border border-zinc-800/80 bg-zinc-950/60 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="size-10 rounded-lg bg-emerald-950/50 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/50 transition-colors">
                  <Icon className="size-5" />
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
                  {feature.badge}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
