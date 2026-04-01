# SiftTools Editorial Standards

This document is the single source of truth for all content on sifttools.com.
Every review, comparison, and page copy must follow these rules.
The generate_content.py prompt must reflect this document exactly.

---

## 1. Voice & Perspective

**Editor's voice** — No first person, but opinionated.

- Never: "I tested Jasper for 6 months"
- Never: "In my experience..."
- Good: "Jasper's Brand Voice feature reproduces a given tone with ~85% accuracy based on 4,000 words of training data."
- Good: "The free plan is generous, but the 40k word cap will frustrate any agency producing more than 10 posts per month."

The writer has opinions and makes recommendations, but never claims personal usage history.
Think: a knowledgeable editor who has studied the tool thoroughly, not a fake user pretending to have lived with it.

---

## 2. Absolute Don'ts

| Category | Examples | Why |
|----------|----------|-----|
| Fake usage duration | "After 6 months of daily use..." | Fabricated credibility |
| Fake client stories | "My client got $2.3M in funding" | Unverifiable claims |
| Fake social proof | Reddit quotes, Twitter reactions | Invented attribution |
| Fake metrics from experience | "I generated 200+ videos" | Simulated data |
| AI filler phrases | "In today's rapidly evolving...", "Whether you're a...", "When it comes to..." | Instant AI smell |
| Defensive trust claims | "No hype", "We're independent", "Honest reviews" | Saying you're trustworthy = not trustworthy |
| Placeholder sections | "We're curating video reviews... check back soon!" | Empty content is worse than no section |
| Emoji in body copy | Any emoji in review text or UI copy | Unprofessional, AI signal |

---

## 3. Required Elements

Every review must include:

### 3-1. Verifiable facts only
- Pricing from the official site (with plan names and limits)
- Feature specs from documentation (word limits, export formats, supported languages)
- Publicly known comparisons (pricing vs competitor, feature presence/absence)
- When a number is cited, it must come from the tool's own marketing, docs, or widely reported benchmarks — not from simulated personal experience

### 3-2. Pricing table
- Every plan with price, key features, and a brief value judgment
- Compare to at least one competitor's pricing

### 3-3. Clear recommendation
- "Best for: [specific persona]"
- "Skip if: [specific situation]"
- Direct, not hedged with "it depends on your needs"

### 3-4. Competitor comparisons
- Name at least 2 competitors
- Compare on specific dimensions (price, feature X, output quality)
- State which tool wins on each dimension

### 3-5. Honest cons
- At least 3 real limitations
- Be specific: "No API on the $49/mo plan" not "Could be better in some areas"

---

## 4. Structure Rules

### No two reviews should look the same.

Pick 5-7 sections from this menu. Vary the order per review:

- **Overview** — What it does, who it's for, 2 paragraphs max
- **Key Features** — 3-4 features with ### subheadings using actual feature names
- **What's Missing** — 1-2 specific gaps
- **Pricing Breakdown** — Table + 1 paragraph value analysis
- **Best For / Skip If** — Bullet lists
- **vs [Competitor]** — Head-to-head on 2-3 dimensions
- **Use Cases** — 2-3 specific workflows where the tool excels
- **Bottom Line** — 1-2 paragraphs, clear recommendation

Rules:
- First section is NOT always "Overview" — sometimes lead with Pricing, sometimes with a competitor comparison
- Section titles should vary: "What You Get for $30/mo" instead of always "Pricing Breakdown"
- No section should repeat information from another section

---

## 5. Tone Calibration

### Do
- Short paragraphs (3-4 sentences max)
- Concrete nouns and numbers over adjectives
- "The Pro plan costs $60/mo and includes 30 hours of fast GPU time" > "The Pro plan offers great value with generous GPU allocation"
- State trade-offs directly: "Faster than DALL-E 3, but no inpainting"

### Don't
- Superlatives without evidence: "the most powerful", "absolutely incredible"
- Weasel words: "relatively", "fairly", "quite"
- Marketing copy tone: "supercharge your workflow", "take your content to the next level"
- Transition filler: "Now let's look at...", "Moving on to..."

---

## 6. Frontmatter Standards

```yaml
title: "[Tool] Review 2026: [Specific angle, not generic hype]"
description: "[150-160 chars, includes target keyword naturally]"
rating: [3.0-5.0, honest — 4.0+ means genuinely good]
price: "[From official site]"
affiliateUrl: "[From affiliate_links.json]"
category: "[From CATEGORY_MAP]"
publishedAt: "[Stagger dates, never all same day]"
pros:
  - "[Specific, with numbers or feature names]"
cons:
  - "[Specific, with plan names or limits]"
verdict: "[2 sentences: who + one reason. No hedging.]"
```

---

## 7. Quality Checklist

Before publishing any review:

- [ ] Zero first-person pronouns (I, my, me, we, our)
- [ ] Zero fake usage claims or durations
- [ ] Zero fake stories, anecdotes, or case studies
- [ ] All prices match the tool's current pricing page
- [ ] At least 2 competitors named and compared
- [ ] At least 3 specific cons listed
- [ ] Section order differs from other recent reviews
- [ ] No AI filler phrases (grep for "rapidly evolving", "whether you're", "when it comes to", "in conclusion")
- [ ] No emoji in body text
- [ ] 1200-1800 words total
