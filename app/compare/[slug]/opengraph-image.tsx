import { ImageResponse } from "next/og";
import { getComparisonBySlug, getAllComparisons } from "@/lib/mdx";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllComparisons().map((c) => ({ slug: c.slug }));
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comp = getComparisonBySlug(slug);
  if (!comp) {
    return new ImageResponse(
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#fff", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 48, fontWeight: 800 }}>SiftTools</span>
      </div>,
      { ...size }
    );
  }

  const { meta } = comp;
  const toolA = meta.tools[0] || "";
  const toolB = meta.tools[1] || "";

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#111827",
        padding: 60,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "white", fontSize: 20, fontWeight: 900 }}>S</span>
        </div>
        <span style={{ fontSize: 22, fontWeight: 800, color: "#f9fafb" }}>
          Sift<span style={{ color: "#34d399" }}>Tools</span>
        </span>
        <span style={{ fontSize: 16, color: "#6b7280", marginLeft: 16, fontWeight: 600 }}>
          COMPARISON
        </span>
      </div>

      {/* VS section */}
      <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", gap: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 44, fontWeight: 800, color: "#f9fafb", textAlign: "center" }}>
            {toolA}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            width: 80,
            height: 80,
            borderRadius: 40,
            background: "#059669",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ color: "white", fontSize: 24, fontWeight: 800 }}>VS</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 44, fontWeight: 800, color: "#f9fafb", textAlign: "center" }}>
            {toolB}
          </span>
        </div>
      </div>

      {/* Winner + URL */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {meta.winner && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "#065f46", borderRadius: 12 }}>
            <span style={{ fontSize: 16, color: "#34d399", fontWeight: 700 }}>
              Winner: {meta.winner}
            </span>
          </div>
        )}
        <span style={{ fontSize: 16, color: "#6b7280", fontWeight: 600 }}>sifttools.com</span>
      </div>
    </div>,
    { ...size }
  );
}
