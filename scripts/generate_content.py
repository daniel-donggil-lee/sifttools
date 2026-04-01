#!/usr/bin/env python3
"""
SiftTools — AI 도구 리뷰 MDX 자동 생성 스크립트
tools_db.json + affiliate_links.json → Claude API → content/tools/*.mdx

Usage:
  python generate_content.py           # 다음 2개 도구 리뷰 생성
  python generate_content.py 3         # 다음 3개 도구 리뷰 생성
  python generate_content.py --regen   # 기존 리뷰 전부 재생성 (품질 업그레이드)
  python generate_content.py --regen jasper surfer-seo  # 특정 도구만 재생성
"""

import json
import os
import sys
import subprocess
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


def get_all_tools() -> dict[str, dict]:
    """모든 도구를 id 기준 dict로 반환."""
    tools_db = load_json(DATA_DIR / "tools_db.json")
    affiliate = load_json(DATA_DIR / "affiliate_links.json")
    result = {}
    for tool in tools_db["tools"]:
        aff = affiliate["links"].get(tool["id"], {})
        tool["affiliate_url"] = aff.get("affiliate_url") or aff.get("url", tool["url"])
        tool["commission"] = aff.get("commission", "")
        result[tool["id"]] = tool
    return result


def get_next_tools(count: int = 2) -> list[dict]:
    """발행되지 않은 도구 중 priority 순으로 count개 반환."""
    all_tools = get_all_tools()
    published = get_published_ids()

    candidates = [t for t in all_tools.values() if t["id"] not in published]
    candidates.sort(key=lambda t: t["priority"])
    return candidates[:count]


def search_youtube(query: str, count: int = 2) -> list[dict]:
    """yt-dlp로 YouTube 검색하여 실제 영상 ID, 제목, 채널명 반환."""
    try:
        result = subprocess.run(
            ["yt-dlp", f"ytsearch{count}:{query}", "--flat-playlist", "--dump-json"],
            capture_output=True, text=True, timeout=30,
        )
        videos = []
        for line in result.stdout.strip().split("\n"):
            if not line:
                continue
            d = json.loads(line)
            videos.append({
                "id": d.get("id", ""),
                "title": d.get("title", ""),
                "channel": d.get("channel") or d.get("uploader", "Unknown"),
            })
        return videos
    except Exception:
        return []


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

REVIEW_PROMPT = """You are writing an AI tool review for SiftTools.com.

Your writing style:
- Third person, informational tone — NOT first person
- Specific and direct — never vague or promotional
- Include exact numbers (pricing tiers, limits, export formats)
- Compare to competitors by name where relevant
- Short paragraphs, scannable, no filler
- NO fake personal experiences ("I tested for 6 months", "I switched to...")
- NO Reddit quotes or YouTube embeds
- NO phrases like "In today's rapidly evolving...", "Whether you're a...", "In conclusion..."

Tool info:
- Name: {name}
- Category: {category}
- URL: {url}
- Pricing: {pricing}
- Description: {description}
- Tags: {tags}

TARGET KEYWORD: "{keyword}"
Use it naturally in the title, first paragraph, and 2-3 subheadings.

IMPORTANT: Vary the section structure for each review. Do NOT use the same section order every time.
Pick 5-7 sections from the options below and arrange them in an order that makes sense for this specific tool:

Output EXACTLY this MDX format. No text before or after:

---
title: "{name} Review 2026: [Subtitle that includes target keyword naturally]"
description: "[SEO meta description 150-160 chars, includes target keyword]"
rating: [Honest rating 3.0-5.0 — 4.0+ means genuinely good, 3.x means decent with caveats]
price: "{pricing}"
affiliateUrl: "{affiliate_url}"
category: "{category_slug}"
publishedAt: "{today}"
image: "/images/{slug}.png"
pros:
  - "[Specific pro with a number or comparison]"
  - "[Pro 2 — mention a specific feature name]"
  - "[Pro 3]"
  - "[Pro 4]"
cons:
  - "[Honest con — e.g. 'No API access on the $49/mo plan']"
  - "[Con 2 — mention a specific limitation]"
  - "[Con 3]"
verdict: "[2 sentences: who it's best for and one specific reason why. Be direct.]"
---

SECTION OPTIONS (pick 5-7, vary the order):

- **Overview** — What {name} does, who it's for, how it compares at a high level. 2 short paragraphs.
- **Key Features** — 3-4 features with specific details. Use ### subheadings with actual feature names.
- **What's Missing** — 1-2 features the tool lacks. Be specific.
- **Pricing Breakdown** — Table with plans, prices, key features, and a brief take on value.
- **Who It's For / Who Should Skip It** — Bullet lists of good-fit and bad-fit scenarios.
- **How It Compares to [Competitor]** — Direct comparison on 2-3 dimensions.
- **Use Cases** — 2-3 specific workflows where this tool excels.
- **Bottom Line** — 1-2 paragraphs with a clear recommendation.

CRITICAL RULES:
- Do NOT simulate personal experience. Write factual analysis.
- Do NOT include Reddit quotes or YouTube sections.
- Include at least 3 specific numbers/metrics throughout the review.
- Mention at least 2 competitor tools by name for comparison.
- Keep total length 1200-1800 words.
- Every section must add unique value — no repeating the same point.
"""

KEYWORDS = {
    "jasper": "best AI writing tool for marketing teams",
    "surfer-seo": "best SEO content optimization tool",
    "copy-ai": "best free AI copywriting tool",
    "writesonic": "best affordable AI writer for blogs",
    "notion-ai": "best AI productivity tool for teams",
    "midjourney": "best AI image generator for designers",
    "cursor": "best AI code editor for developers",
    "claude": "best AI chatbot for reasoning and coding",
    "runway-ml": "best AI video generator",
    "descript": "best AI video editing software",
    "synthesia": "best AI avatar video maker",
    "elevenlabs": "best AI voice generator text to speech",
    "gamma": "best AI presentation maker",
    "beautiful-ai": "best AI slide design tool",
    "otter-ai": "best AI meeting transcription tool",
    "grammarly": "best AI grammar checker and writing assistant",
    "canva-ai": "best AI design tool for non-designers",
    "adobe-firefly": "best AI image generator for professionals",
    "perplexity": "best AI search engine for research",
    "pika": "best free AI video generator",
}


def build_youtube_section(tool_name: str) -> str:
    """실제 YouTube 검색으로 영상을 찾아 임베드 섹션 생성."""
    videos = search_youtube(f"{tool_name} review", count=2)
    if not videos:
        return (
            "## What YouTubers Are Saying\n\n"
            "We're currently curating video reviews for this tool. Check back soon!"
        )

    section = "## What YouTubers Are Saying\n\n"
    for i, v in enumerate(videos, 1):
        section += f"### Review {i}: {v['channel']}\n\n"
        section += (
            f'<iframe width="100%" height="400" '
            f'src="https://www.youtube.com/embed/{v["id"]}" '
            f'title="{v["title"]}" frameBorder="0" '
            f'allow="accelerometer; autoplay; clipboard-write; encrypted-media; '
            f'gyroscope; picture-in-picture" allowFullScreen></iframe>\n\n'
        )
        section += f"**{v['channel']}** — [SUMMARY: Write 1-2 sentences about what this reviewer likely covers based on the title \"{v['title']}\"]\n\n"

    section += "**The consensus:** [1-2 sentences summarizing where reviewers generally agree and disagree.]\n"
    return section


def generate_review(tool: dict) -> str:
    client = anthropic.Anthropic()
    today = date.today().isoformat()
    slug = tool["id"]
    category_slug = CATEGORY_MAP.get(tool["category"], "productivity")
    keyword = KEYWORDS.get(slug, f"best {tool['category'].lower()} AI tool")

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
        keyword=keyword,
    )

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=6000,
        messages=[{"role": "user", "content": prompt}],
    )

    return message.content[0].text


def save_review(tool: dict, content: str, skip_published: bool = False):
    slug = tool["id"]
    filepath = CONTENT_DIR / f"{slug}.mdx"
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  Saved: {filepath}")

    if not skip_published:
        pub = load_json(PUBLISHED_FILE)
        if not any(p["tool_id"] == slug for p in pub["posts"]):
            pub["posts"].append({
                "tool_id": slug,
                "published_at": date.today().isoformat(),
            })
            save_json(PUBLISHED_FILE, pub)


def main():
    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("Error: ANTHROPIC_API_KEY not set")
        sys.exit(1)

    # --regen 모드: 기존 리뷰 재생성
    if "--regen" in sys.argv:
        all_tools = get_all_tools()
        targets = [a for a in sys.argv[1:] if a != "--regen"]

        if targets:
            tools = [all_tools[t] for t in targets if t in all_tools]
        else:
            published = get_published_ids()
            tools = [all_tools[t] for t in published if t in all_tools]

        if not tools:
            print("No tools to regenerate.")
            return

        print(f"Regenerating {len(tools)} reviews...")
        for tool in tools:
            print(f"\n  Regenerating: {tool['name']} ({tool['category']})")
            content = generate_review(tool)
            save_review(tool, content, skip_published=True)
        print(f"\nDone! {len(tools)} reviews regenerated.")
        return

    # 일반 모드: 새 리뷰 생성
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 2

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
