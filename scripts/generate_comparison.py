#!/usr/bin/env python3
"""
SiftTools — AI 도구 비교 MDX 자동 생성 스크립트
같은 카테고리 도구끼리 head-to-head 비교 콘텐츠 생성
"""

import json
import os
import sys
from pathlib import Path
from datetime import date
from itertools import combinations

import anthropic

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
CONTENT_DIR = PROJECT_ROOT / "content" / "comparisons"
PUBLISHED_FILE = DATA_DIR / "published.json"

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


def load_json(path: Path) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path: Path, data: dict):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


def get_published_comparisons() -> set:
    pub = load_json(PUBLISHED_FILE)
    return {p["tool_id"] for p in pub.get("posts", []) if p["tool_id"].startswith("compare-")}


def get_comparison_pairs(count: int = 1) -> list[tuple[dict, dict]]:
    """같은 카테고리 도구 쌍 중 아직 비교하지 않은 것 반환."""
    tools_db = load_json(DATA_DIR / "tools_db.json")
    published = get_published_comparisons()

    by_category = {}
    for tool in tools_db["tools"]:
        cat = tool["category"]
        by_category.setdefault(cat, []).append(tool)

    pairs = []
    for cat, tools in by_category.items():
        if len(tools) < 2:
            continue
        for a, b in combinations(tools, 2):
            slug = f"compare-{a['id']}-vs-{b['id']}"
            if slug not in published:
                pairs.append((a, b, slug))

    pairs.sort(key=lambda p: p[0]["priority"] + p[1]["priority"])
    return [(a, b, s) for a, b, s in pairs[:count]]


COMPARISON_PROMPT = """You are a professional tech reviewer writing for SiftTools.com.

Write a head-to-head comparison of {name_a} vs {name_b} as an MDX file.

Tool A:
- Name: {name_a}
- Category: {category}
- Pricing: {pricing_a}
- Description: {desc_a}

Tool B:
- Name: {name_b}
- Category: {category}
- Pricing: {pricing_b}
- Description: {desc_b}

Output EXACTLY this format:

---
title: "{name_a} vs {name_b}: Which Is Better in 2026?"
description: "[SEO meta description comparing both tools, 150-160 chars]"
tools:
  - "{name_a}"
  - "{name_b}"
category: "{category_slug}"
publishedAt: "{today}"
winner: "[name_a or name_b — pick the better overall tool]"
---

## {name_a} vs {name_b}: Quick Summary

| Feature | {name_a} | {name_b} |
|---------|----------|----------|
| Best For | [1 line] | [1 line] |
| Pricing | {pricing_a} | {pricing_b} |
| Ease of Use | [rating /5] | [rating /5] |
| Output Quality | [rating /5] | [rating /5] |
| Value for Money | [rating /5] | [rating /5] |

## Overview

[2 paragraphs setting up the comparison]

## Features Comparison

### [Feature Category 1]
[Compare both tools on this feature, 2-3 sentences each]

### [Feature Category 2]
[Compare both tools]

### [Feature Category 3]
[Compare both tools]

## Pricing Comparison

[Detailed pricing breakdown for both]

## When to Choose {name_a}

[2-3 bullet points]

## When to Choose {name_b}

[2-3 bullet points]

## Our Verdict

[2 paragraphs with clear winner and reasoning]

RULES:
- Be decisive. Pick a winner.
- Be honest about both tools' strengths and weaknesses.
- No filler phrases.
- Under 700 words total.
"""


def generate_comparison(tool_a: dict, tool_b: dict) -> str:
    client = anthropic.Anthropic()
    today = date.today().isoformat()
    category_slug = CATEGORY_MAP.get(tool_a["category"], "productivity")

    prompt = COMPARISON_PROMPT.format(
        name_a=tool_a["name"],
        name_b=tool_b["name"],
        category=tool_a["category"],
        pricing_a=tool_a["pricing"],
        pricing_b=tool_b["pricing"],
        desc_a=tool_a["description"],
        desc_b=tool_b["description"],
        category_slug=category_slug,
        today=today,
    )

    message = anthropic.Anthropic().messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}],
    )

    return message.content[0].text


def save_comparison(slug: str, content: str):
    CONTENT_DIR.mkdir(parents=True, exist_ok=True)
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
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 1

    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("Error: ANTHROPIC_API_KEY not set")
        sys.exit(1)

    pairs = get_comparison_pairs(count)
    if not pairs:
        print("All comparisons have been published!")
        return

    print(f"Generating {len(pairs)} comparisons...")
    for tool_a, tool_b, slug in pairs:
        print(f"\n  Generating: {tool_a['name']} vs {tool_b['name']}")
        content = generate_comparison(tool_a, tool_b)
        save_comparison(slug, content)

    print(f"\nDone! {len(pairs)} comparisons generated.")


if __name__ == "__main__":
    main()
