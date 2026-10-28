import { LandingPageContent } from "@/features/landing/components/landing-page-content";

export const metadata = {
  title: "ShipTidy — AI Code Reviewer for GitHub Pull Requests",
  description:
    "Automated, context-aware AI reviews for every pull request on your GitHub repositories. Catch bugs, enforce best practices, and ship code faster.",
};

export default function HomePage() {
  return <LandingPageContent />;
}
