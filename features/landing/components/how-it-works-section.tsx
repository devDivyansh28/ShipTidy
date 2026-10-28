import { GitPullRequestIcon, SparkleIcon, CheckCircleIcon } from "@phosphor-icons/react/dist/ssr";

const STEPS = [
  {
    step: "01",
    title: "Connect GitHub",
    description: "Install the official ShipTidy GitHub App on your personal profile or team organization with just 1 click.",
    icon: GitPullRequestIcon,
  },
  {
    step: "02",
    title: "Open or Update a PR",
    description: "ShipTidy automatically intercepts GitHub webhooks for every opened, synchronized, or reopened pull request.",
    icon: SparkleIcon,
  },
  {
    step: "03",
    title: "Review & Ship with Confidence",
    description: "Read pinpoint markdown feedback covering security, correctness, and performance, then merge your clean code.",
    icon: CheckCircleIcon,
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-4 max-w-6xl mx-auto border-t border-zinc-900">
      <div className="text-center mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
          How ShipTidy Works
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
          From first install to your next pull request in under two minutes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="relative p-6 rounded-xl border border-zinc-800/80 bg-zinc-950/40 text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-2xl font-bold text-zinc-700">
                    {s.step}
                  </span>
                  <div className="size-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
                    <Icon className="size-4" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {s.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
