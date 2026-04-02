"""
Google Search Console data fetcher for SiftTools daily report.

Usage:
  python scripts/fetch_gsc.py

Requires:
  - GSC_CREDENTIALS_B64 environment variable (base64-encoded Service Account JSON)
  - Site verified in Google Search Console: https://sifttools.com/

Output:
  - Prints a markdown summary to stdout
  - Saves full data to data/gsc_latest.json
"""

import os
import sys
import json
import base64
import tempfile
from datetime import date, timedelta

try:
    from googleapiclient.discovery import build
    from google.oauth2 import service_account
except ImportError:
    print("ERROR: Required packages not installed. Run: pip install google-api-python-client google-auth")
    sys.exit(1)


SITE_URL = "https://sifttools.com/"
SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]
DATA_FILE = os.path.join(os.path.dirname(__file__), "../data/gsc_latest.json")


def get_credentials():
    creds_b64 = os.environ.get("GSC_CREDENTIALS_B64")
    if not creds_b64:
        # Fallback: look for local key file (for local dev)
        key_path = os.path.join(os.path.dirname(__file__), "../.gsc-key.json")
        if os.path.exists(key_path):
            return service_account.Credentials.from_service_account_file(key_path, scopes=SCOPES)
        print("ERROR: GSC_CREDENTIALS_B64 env var not set and .gsc-key.json not found.")
        sys.exit(1)

    key_data = base64.b64decode(creds_b64).decode("utf-8")
    with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
        f.write(key_data)
        tmp_path = f.name

    creds = service_account.Credentials.from_service_account_file(tmp_path, scopes=SCOPES)
    os.unlink(tmp_path)
    return creds


def fetch_data(service, start_date, end_date, dimensions, row_limit=10):
    request = {
        "startDate": start_date.isoformat(),
        "endDate": end_date.isoformat(),
        "dimensions": dimensions,
        "rowLimit": row_limit,
        "dataState": "final",
    }
    response = service.searchanalytics().query(siteUrl=SITE_URL, body=request).execute()
    return response.get("rows", [])


def main():
    today = date.today()
    yesterday = today - timedelta(days=1)
    # GSC data is typically 2-3 days delayed; use last 7 days for queries
    week_ago = today - timedelta(days=7)

    creds = get_credentials()
    service = build("searchconsole", "v1", credentials=creds, cache_discovery=False)

    # 1. Overall performance (last 7 days)
    overall = service.searchanalytics().query(
        siteUrl=SITE_URL,
        body={
            "startDate": week_ago.isoformat(),
            "endDate": yesterday.isoformat(),
            "dataState": "final",
        }
    ).execute()

    total_clicks = overall.get("rows", [{}])[0].get("clicks", 0) if overall.get("rows") else 0
    total_impressions = overall.get("rows", [{}])[0].get("impressions", 0) if overall.get("rows") else 0
    avg_ctr = overall.get("rows", [{}])[0].get("ctr", 0) if overall.get("rows") else 0
    avg_position = overall.get("rows", [{}])[0].get("position", 0) if overall.get("rows") else 0

    # 2. Top queries (last 7 days)
    top_queries = fetch_data(service, week_ago, yesterday, ["query"], row_limit=10)

    # 3. Top pages (last 7 days)
    top_pages = fetch_data(service, week_ago, yesterday, ["page"], row_limit=10)

    # 4. High impression / low CTR queries (optimization targets)
    all_queries = fetch_data(service, week_ago, yesterday, ["query"], row_limit=50)
    optimization_targets = [
        r for r in all_queries
        if r.get("impressions", 0) >= 50 and r.get("ctr", 1) < 0.03
    ]
    optimization_targets.sort(key=lambda x: x.get("impressions", 0), reverse=True)

    # Save full data
    output = {
        "generated_at": today.isoformat(),
        "period": {"start": week_ago.isoformat(), "end": yesterday.isoformat()},
        "summary": {
            "clicks": int(total_clicks),
            "impressions": int(total_impressions),
            "ctr": round(avg_ctr * 100, 2),
            "avg_position": round(avg_position, 1),
        },
        "top_queries": [
            {
                "query": r["keys"][0],
                "clicks": int(r.get("clicks", 0)),
                "impressions": int(r.get("impressions", 0)),
                "ctr": round(r.get("ctr", 0) * 100, 2),
                "position": round(r.get("position", 0), 1),
            }
            for r in top_queries
        ],
        "top_pages": [
            {
                "page": r["keys"][0].replace(SITE_URL, "/"),
                "clicks": int(r.get("clicks", 0)),
                "impressions": int(r.get("impressions", 0)),
                "ctr": round(r.get("ctr", 0) * 100, 2),
                "position": round(r.get("position", 0), 1),
            }
            for r in top_pages
        ],
        "optimization_targets": [
            {
                "query": r["keys"][0],
                "impressions": int(r.get("impressions", 0)),
                "ctr": round(r.get("ctr", 0) * 100, 2),
                "position": round(r.get("position", 0), 1),
            }
            for r in optimization_targets[:5]
        ],
    }

    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, "w") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    # Print markdown summary
    s = output["summary"]
    print(f"""## Google Search Console ({week_ago} ~ {yesterday})

| 지표 | 값 |
|------|-----|
| 클릭 | {s['clicks']:,} |
| 노출 | {s['impressions']:,} |
| 평균 CTR | {s['ctr']}% |
| 평균 순위 | {s['avg_position']} |

### 상위 검색어 (클릭 기준)""")

    for r in output["top_queries"][:5]:
        print(f"- `{r['query']}` — 클릭 {r['clicks']}, 노출 {r['impressions']:,}, CTR {r['ctr']}%, 순위 {r['position']}")

    print("\n### 상위 페이지 (클릭 기준)")
    for r in output["top_pages"][:5]:
        print(f"- `{r['page']}` — 클릭 {r['clicks']}, 노출 {r['impressions']:,}, CTR {r['ctr']}%")

    if output["optimization_targets"]:
        print("\n### 노출 있으나 CTR 낮은 키워드 (제목/메타 개선 필요)")
        for r in output["optimization_targets"]:
            print(f"- `{r['query']}` — 노출 {r['impressions']:,}, CTR {r['ctr']}%, 순위 {r['position']}")

    print(f"\n_전체 데이터: data/gsc_latest.json_")


if __name__ == "__main__":
    main()
