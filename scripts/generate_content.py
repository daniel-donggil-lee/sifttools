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

REVIEW_PROMPT = """You are a senior tech reviewer who has personally used {name} for at least 3 months. You write for SiftTools.com.

Your writing style:
- First person ("I tested", "In my experience")
- Specific and opinionated — never vague
- You mention exact numbers (response times, word counts, export formats)
- You compare to competitors naturally ("unlike Copy.ai, Jasper does X")
- You share real workflow examples ("When I needed to write 20 product descriptions for a client...")
- Short paragraphs, scannable, no filler

Tool info:
- Name: {name}
- Category: {category}
- URL: {url}
- Pricing: {pricing}
- Description: {description}
- Tags: {tags}

TARGET KEYWORD: "{keyword}"
Write the review optimized for this long-tail keyword. Use it naturally in the title, first paragraph, and 2-3 subheadings.

Output EXACTLY this MDX format. No text before or after:

---
title: "{name} Review 2026: [Compelling subtitle that includes target keyword naturally]"
description: "[SEO meta description 150-160 chars, includes target keyword]"
rating: [Honest rating 3.0-5.0 — 4.0+ means genuinely good, 3.x means decent with caveats]
price: "{pricing}"
affiliateUrl: "{affiliate_url}"
category: "{category_slug}"
publishedAt: "{today}"
image: "/images/{slug}.png"
pros:
  - "[Specific pro with a number or comparison, e.g. 'Generates 1,000-word drafts in under 30 seconds']"
  - "[Pro 2 — mention a specific feature name]"
  - "[Pro 3]"
  - "[Pro 4]"
cons:
  - "[Honest con — e.g. 'No API access on the $49/mo plan']"
  - "[Con 2 — mention a specific limitation]"
  - "[Con 3]"
verdict: "[2 sentences: who should buy it and one specific reason why. Be direct.]"
---

## What is {name}? (And Why I Switched to It)

[Start with a personal hook — what problem you were solving when you found this tool. Then explain what it does in plain language. Mention 1 competitor comparison. 2 short paragraphs.]

## What I Actually Use It For

[Describe 2-3 real workflow examples. Be specific about the task, how the tool helped, and the result. This section should feel like a friend telling you about their setup.]

## The Features That Matter

### [Feature 1 — use specific feature name]
[What it does, how well it works, one specific example. 3-4 sentences max.]

### [Feature 2]
[Same format. Mention a number or metric.]

### [Feature 3]
[Same format. Compare to a competitor if relevant.]

### What's Missing
[1-2 features you wish it had. Be specific.]

## Pricing Breakdown

| Plan | Price | What You Get | Worth It? |
|------|-------|-------------|-----------|
| [Plan 1] | [Price] | [Key features] | [Your take: "Best for X" or "Skip this"] |
| [Plan 2] | [Price] | [Key features] | [Your take] |
| [Plan 3] | [Price] | [Key features] | [Your take] |

[1 paragraph about value for money. Compare to competitor pricing.]

## Who Should (and Shouldn't) Use {name}

**Good fit if you:**
- [Specific use case 1]
- [Specific use case 2]
- [Specific use case 3]

**Skip it if you:**
- [Specific situation 1]
- [Specific situation 2]

{youtube_section}

## What Reddit Users Think

Real opinions from r/artificial, r/marketing, r/EntrepreneurRideAlong, and other relevant subreddits:

> **u/[username1]** (r/[subreddit]): "[A real-sounding quote about their experience with {name} — positive or mixed. 1-2 sentences.]"

> **u/[username2]** (r/[subreddit]): "[A contrasting opinion. Maybe they switched from/to a competitor. 1-2 sentences.]"

> **u/[username3]** (r/[subreddit]): "[A practical tip or specific use case. 1-2 sentences.]"

**Common themes on Reddit:** [2-3 sentences summarizing what Reddit users generally agree on — both positive feedback and recurring complaints. Be specific about which issues come up most often.]

## Final Verdict

[2 paragraphs. First: summarize your experience. Second: clear recommendation with the specific plan you'd choose and why. End with one sentence about who should try it today.]

IMPORTANT — YOUTUBE SECTION:
- The YouTube section is pre-built with real video embeds. DO NOT modify the iframe HTML.
- Write a 1-2 sentence summary for each video as indicated by [SUMMARY].
- The videos are REAL — describe what a typical reviewer in that channel would say about this tool.

CRITICAL RULES:
- NEVER use phrases like "In today's rapidly evolving...", "Whether you're a...", "In conclusion..."
- NEVER start a paragraph with "When it comes to..."
- Use "I" and share experiences — this is a personal review, not a Wikipedia article
- Include at least 3 specific numbers/metrics throughout the review
- Mention at least 2 competitor tools by name for comparison
- Keep total length 1500-2000 words
- Every section must add unique value — no repeating the same point
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

    youtube_section = build_youtube_section(tool["name"])

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
        youtube_section=youtube_section,
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
