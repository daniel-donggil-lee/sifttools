#!/usr/bin/env python3
"""
SiftTools — AI 도구 리뷰 MDX 자동 생성 스크립트
tools_db.json + affiliate_links.json → Claude API → content/tools/*.mdx
"""

import json
import os
import sys
from pathlib import Path
from datetime import date

import anthropic

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
CONTENT_DIR = PROJECT_ROOT / "content" / "tools"
PUBLISHED_FILE = DATA_DIR / "published.json"


def load_json(path: Path) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path: Path, data: dict):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


def get_published_ids() -> set:
    pub = load_json(PUBLISHED_FILE)
    return {p["tool_id"] for p in pub.get("posts", [])}


def get_next_tools(count: int = 2) -> list[dict]:
    """발행되지 않은 도구 중 priority 순으로 count개 반환."""
    tools_db = load_json(DATA_DIR / "tools_db.json")
    affiliate = load_json(DATA_DIR / "affiliate_links.json")
    published = get_published_ids()

    candidates = []
    for tool in tools_db["tools"]:
        if tool["id"] in published:
            continue
        if tool["id"] == "jasper":  # 이미 수동 작성됨
            continue
        aff = affiliate["links"].get(tool["id"], {})
        tool["affiliate_url"] = aff.get("affiliate_url") or aff.get("url", tool["url"])
        tool["commission"] = aff.get("commission", "")
        candidates.append(tool)

    candidates.sort(key=lambda t: t["priority"])
    return candidates[:count]


CATEGORY_MAP = {
    "Writing": "writing",
    "Image": "image",
    "Video": "video",
    "Audio": "audio",
    "Coding": "coding",
    "Productivity": "productivity",
    "Marketing": "marketing",
    "Chatbot": "chatbot",
    "SEO": "writing",
}

REVIEW_PROMPT = """You are a professional tech reviewer writing for SiftTools.com, an AI tools review site.

Write a detailed, honest review of {name} as an MDX file. The review must feel authentic — not generic AI slop.

Tool info:
- Name: {name}
- Category: {category}
- URL: {url}
- Pricing: {pricing}
- Description: {description}
- Tags: {tags}

Output EXACTLY this format (MDX with YAML frontmatter). Do NOT add any text before or after:

---
title: "{name} Review 2026: [Write a compelling subtitle]"
description: "[Write a 1-sentence SEO meta description, 150-160 chars]"
rating: [Give honest rating 3.0-5.0 based on market reputation]
price: "{pricing}"
affiliateUrl: "{affiliate_url}"
category: "{category_slug}"
publishedAt: "{today}"
image: "/images/{slug}.png"
pros:
  - "[Pro 1 - specific, not generic]"
  - "[Pro 2]"
  - "[Pro 3]"
  - "[Pro 4]"
cons:
  - "[Con 1 - honest criticism]"
  - "[Con 2]"
  - "[Con 3]"
verdict: "[2-sentence verdict: who it's best for and why]"
---

## What is {name}?

[2-3 paragraphs introducing the tool. Be specific about what makes it unique.]

## Key Features

### [Feature 1]
[2-3 sentences]

### [Feature 2]
[2-3 sentences]

### [Feature 3]
[2-3 sentences]

## Pricing

| Plan | Price | Key Features |
|------|-------|-------------|
| [Plan 1] | [Price] | [Features] |
| [Plan 2] | [Price] | [Features] |
| [Plan 3] | [Price] | [Features] |

## Who Should Use {name}?

[2 paragraphs about ideal users and use cases]

## The Bottom Line

[1-2 paragraphs final assessment]

IMPORTANT RULES:
- Be honest. If a tool has real weaknesses, say so.
- Rating should reflect actual market consensus, not inflated scores.
- No filler phrases like "In the ever-evolving landscape of AI..."
- Write like a knowledgeable human, not a marketing bot.
- Keep it under 800 words total.
"""


def generate_review(tool: dict) -> str:
    client = anthropic.Anthropic()
    today = date.today().isoformat()
    slug = tool["id"]
    category_slug = CATEGORY_MAP.get(tool["category"], "productivity")

    prompt = REVIEW_PROMPT.format(
        name=tool["name"],
        category=tool["category"],
        url=tool["url"],
        pricing=tool["pricing"],
        description=tool["description"],
        tags=", ".join(tool["tags"]),
        affiliate_url=tool["affiliate_url"],
        category_slug=category_slug,
        today=today,
        slug=slug,
    )

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}],
    )

    return message.content[0].text


def save_review(tool: dict, content: str):
    slug = tool["id"]
    filepath = CONTENT_DIR / f"{slug}.mdx"
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  Saved: {filepath}")

    pub = load_json(PUBLISHED_FILE)
    pub["posts"].append({
        "tool_id": slug,
        "published_at": date.today().isoformat(),
    })
    save_json(PUBLISHED_FILE, pub)


def main():
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 2

    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("Error: ANTHROPIC_API_KEY not set")
        sys.exit(1)

    tools = get_next_tools(count)
    if not tools:
        print("All tools have been published!")
        return

    print(f"Generating {len(tools)} reviews...")
    for tool in tools:
        print(f"\n  Generating: {tool['name']} ({tool['category']})")
        content = generate_review(tool)
        save_review(tool, content)

    print(f"\nDone! {len(tools)} reviews generated.")


if __name__ == "__main__":
    main()
