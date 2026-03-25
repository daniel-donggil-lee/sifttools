import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About SiftTools",
  description:
    "SiftTools provides honest, in-depth reviews of AI tools to help you make better decisions.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
        About SiftTools
      </h1>

      <div className="prose max-w-none">
        <p>
          The AI tool landscape is overwhelming. New products launch every day,
          each claiming to be the best. How do you decide what&#39;s actually
          worth your time and money?
        </p>
        <p>
          That&#39;s where SiftTools comes in. We test AI tools hands-on and
          write honest, detailed reviews. No fluff, no hype — just clear
          analysis of what works, what doesn&#39;t, and who each tool is best
          for.
        </p>

        <h2>What We Cover</h2>
        <ul>
          <li>
            <strong>In-depth reviews</strong> — Features, pricing, pros, cons,
            and our verdict.
          </li>
          <li>
            <strong>Head-to-head comparisons</strong> — Side-by-side breakdowns
            to help you choose.
          </li>
          <li>
            <strong>Category guides</strong> — Best tools for writing, image
            generation, video, coding, and more.
          </li>
        </ul>

        <h2>Affiliate Disclosure</h2>
        <p>
          Some links on this site are affiliate links. This means we may earn a
          commission if you sign up through our link, at no extra cost to you.
          This helps us keep the site running and free to use. Our reviews are
          always honest regardless of affiliate relationships.
        </p>
      </div>
    </div>
  );
}
