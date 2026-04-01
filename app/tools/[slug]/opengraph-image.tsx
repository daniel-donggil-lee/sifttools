import { ImageResponse } from "next/og";
import { getToolBySlug, getAllTools } from "@/lib/mdx";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllTools().map((t) => ({ slug: t.slug }));
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) {
    return new ImageResponse(
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#fff", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 48, fontWeight: 800 }}>SiftTools</span>
      </div>,
      { ...size }
    );
  }

  const { meta } = tool;
  const scoreColor = meta.rating >= 4.5 ? "#059669" : meta.rating >= 4 ? "#10b981" : meta.rating >= 3 ? "#f59e0b" : "#ef4444";

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "white",
        padding: 60,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "white", fontSize: 20, fontWeight: 900 }}>S</span>
        </div>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#1f2937" }}>
          Sift<span style={{ color: "#059669" }}>Tools</span>
        </span>
        <span style={{ fontSize: 16, color: "#9ca3af", marginLeft: 16, fontWeight: 600 }}>
          {meta.category.toUpperCase()} REVIEW
        </span>
      </div>

      {/* Title */}
      <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <span style={{ fontSize: 48, fontWeight: 800, color: "#111827", lineHeight: 1.1, letterSpacing: -1.5 }}>
            {meta.title}
          </span>
          {meta.verdict && (
            <span style={{ fontSize: 20, color: "#6b7280", marginTop: 16, lineHeight: 1.5 }}>
              {meta.verdict.slice(0, 120)}...
            </span>
          )}
        </div>

        {/* Score circle */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 160,
            height: 160,
            borderRadius: 80,
            border: `6px solid ${scoreColor}`,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 56, fontWeight: 800, color: "#111827" }}>
            {meta.rating.toFixed(1)}
          </span>
          <span style={{ fontSize: 14, color: "#9ca3af", fontWeight: 600 }}>/ 5.0</span>
        </div>
      </div>

      {/* Bottom */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 20 }}>
        <span style={{ fontSize: 16, color: "#6b7280", fontWeight: 600 }}>{meta.price}</span>
        <span style={{ color: "#d1d5db" }}>|</span>
        <span style={{ fontSize: 16, color: "#6b7280", fontWeight: 600 }}>sifttools.com</span>
      </div>
    </div>,
    { ...size }
  );
}
