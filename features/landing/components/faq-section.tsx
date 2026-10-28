"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    value: "github-access",
    question: "How does ShipTidy access my GitHub repositories?",
    answer:
      "ShipTidy connects via an official GitHub App with strictly scoped permissions: read access to pull requests and repository contents, and write access only to post pull request review comments. We never write code to your branches or modify repository settings.",
  },
  {
    value: "data-privacy",
    question: "Does ShipTidy train AI models on my source code?",
    answer:
      "No. Neither ShipTidy nor our upstream AI providers train or retain private models on your proprietary source code. Diffs and chunks are processed in-flight for review generation and discarded, or stored in your private Pinecone namespace solely for context retrieval.",
  },
  {
    value: "pr-workflow",
    question: "Do I need to change how my engineering team works?",
    answer:
      "Not at all. There are no CLI tools to install and no commands to remember. Developers push branches and open pull requests exactly as they do today. ShipTidy listens to GitHub webhooks in real-time and comments automatically.",
  },
  {
    value: "pinecone-sync",
    question: "What is Pinecone Repo Sync and why is it useful?",
    answer:
      "Standard PR reviewers only see the modified lines. By syncing your repository into a Pinecone vector index, ShipTidy can retrieve related models, utility functions, and type definitions across the entire codebase to understand the holistic impact of every change.",
  },
  {
    value: "billing-cancel",
    question: "Can I cancel my subscription at any time?",
    answer:
      "Yes. You can manage, upgrade, or cancel your Pro subscription anytime directly from your dashboard settings. If canceled, your plan remains active until the end of your billing cycle.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24 px-4 max-w-4xl mx-auto border-t border-zinc-900">
      <div className="text-center mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto">
          Common questions about GitHub App permissions, vector context, and AI code analysis.
        </p>
      </div>

      <Accordion className="border-zinc-800 bg-zinc-950/40 rounded-xl overflow-hidden divide-y divide-zinc-800/80">
        {FAQS.map((faq) => (
          <AccordionItem
            key={faq.value}
            value={faq.value}
            className="border-zinc-800 px-4 py-1"
          >
            <AccordionTrigger className="text-sm sm:text-base font-medium text-zinc-200 hover:text-emerald-400 py-4 transition-colors">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-zinc-400 text-xs sm:text-sm leading-relaxed pb-4 pt-1">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
