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
Follow the editorial standards below exactly. Violating any rule = rejected draft.

═══ VOICE ═══
Editor's voice. Opinionated but NEVER first person.
- BANNED: I, my, me, we, our, us — zero occurrences allowed
- BANNED: "I tested", "In my experience", "my client", "my workflow", "I switched"
- GOOD: "Jasper's Brand Voice feature reproduces tone with ~85% accuracy from 4,000 words of training data."
- GOOD: "The free plan is generous, but the 40k word cap will frustrate agencies producing 10+ posts per month."
The writer has studied the tool thoroughly and states opinions, but never claims personal usage.

═══ ABSOLUTE DON'TS ═══
- Fake usage duration ("After 6 months of daily use...")
- Fake client stories ("landed a client $2.3M in funding")
- Fake metrics from experience ("I generated 200+ videos")
- Reddit/Twitter/YouTube quotes or embeds
- AI filler: "In today's rapidly evolving...", "Whether you're a...", "When it comes to...", "In conclusion..."
- Defensive trust claims: "No hype", "honest review", "we're independent"
- Superlatives without evidence: "the most powerful", "absolutely incredible"
- Weasel words: "relatively", "fairly", "quite"
- Marketing tone: "supercharge your workflow", "take your content to the next level"
- Transition filler: "Now let's look at...", "Moving on to..."
- Emoji anywhere in the text

═══ REQUIRED ELEMENTS ═══
1. All prices/specs must be verifiable from the tool's official site or docs
2. Pricing table with every plan, price, key features, and a value judgment
3. At least 2 competitors named and compared on specific dimensions
4. At least 3 specific, honest cons with plan names or limits
5. Clear "Best for" and "Skip if" recommendations — no hedging

═══ STRUCTURE ═══
Pick 5-7 sections from this menu. VARY the order — do NOT start with Overview every time.
Vary section titles too ("What $30/mo Gets You" instead of always "Pricing Breakdown").

Section menu:
- Overview — What it does, who it's for. 2 paragraphs max.
- Key Features — 3-4 features. ### subheadings with actual feature names.
- What's Missing — 1-2 specific gaps.
- Pricing Breakdown — Table + 1 paragraph value analysis vs competitor pricing.
- Best For / Skip If — Bullet lists of specific personas/situations.
- vs [Competitor] — Head-to-head on 2-3 dimensions. Name a winner per dimension.
- Use Cases — 2-3 specific workflows. Describe the task, not a personal anecdote.
- Bottom Line — 1-2 paragraphs with a direct recommendation.

═══ TONE CALIBRATION ═══
- Short paragraphs (3-4 sentences max)
- Concrete nouns and numbers over adjectives
- State trade-offs directly: "Faster than DALL-E 3, but no inpainting"
- No section should repeat information from another section

═══ TOOL INFO ═══
- Name: {name}
- Category: {category}
- URL: {url}
- Pricing: {pricing}
- Description: {description}
- Tags: {tags}

TARGET KEYWORD: "{keyword}"
Use it naturally in the title, first paragraph, and 2-3 subheadings.

═══ OUTPUT FORMAT ═══
Output EXACTLY this MDX format. No text before or after:

---
title: "{name} Review 2026: [Specific angle, not generic hype]"
description: "[150-160 chars SEO meta, includes target keyword]"
rating: [3.0-5.0 — 4.0+ means genuinely good, 3.x means decent with caveats]
price: "{pricing}"
affiliateUrl: "{affiliate_url}"
category: "{category_slug}"
publishedAt: "{today}"
image: "/images/{slug}.png"
pros:
  - "[Specific — include a number or feature name]"
  - "[Pro 2]"
  - "[Pro 3]"
  - "[Pro 4]"
cons:
  - "[Specific — include plan name or limit, e.g. 'No API on the $49/mo plan']"
  - "[Con 2]"
  - "[Con 3]"
verdict: "[2 sentences: who + one specific reason. No hedging.]"
---

[Review body: 1200-1800 words, 5-7 sections from the menu above]

═══ FINAL CHECK ═══
Before outputting, verify:
- Zero first-person pronouns (I/my/me/we/our)
- Zero fake anecdotes or usage claims
- All numbers are from official sources, not invented
- Section order differs from a generic template
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
