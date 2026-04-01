import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About SiftTools",
  description:
    "SiftTools reviews AI tools with honest analysis, pricing breakdowns, and side-by-side comparisons.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
        About SiftTools
      </h1>

      <div className="prose max-w-none">
        <p>
          SiftTools is an AI tool review site. We cover writing assistants,
          image generators, video tools, coding helpers, and more — with
          detailed breakdowns of features, pricing, and trade-offs.
        </p>
        <p>
          Each review includes a scoring rubric, pricing tables, and
          comparisons to similar tools so you can make an informed choice.
        </p>

        <h2>What You&apos;ll Find Here</h2>
        <ul>
          <li>
            <strong>Reviews</strong> — Features, pricing, pros and cons.
          </li>
          <li>
            <strong>Comparisons</strong> — Side-by-side breakdowns of
            competing tools.
          </li>
          <li>
            <strong>Tool Finder</strong> — A quick quiz to match you with
            the right tool.
          </li>
        </ul>

        <h2>Affiliate Disclosure</h2>
        <p>
          Some links on this site are affiliate links. If you sign up through
          one, we may earn a commission at no extra cost to you. This helps
          keep the site running. Affiliate relationships do not affect our
          ratings or rankings.
        </p>
      </div>
    </div>
  );
}
