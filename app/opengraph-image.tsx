import { ImageResponse } from "next/og";

export const alt = "Alhassan Alfarran — Software & DevOps Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "radial-gradient(circle at 15% 10%, #3b1d7a 0%, transparent 45%), radial-gradient(circle at 90% 90%, #0e4d5c 0%, transparent 45%), #0a0a0f",
          color: "#ececf3",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
              color: "white"
            }}
          >
            AA
          </div>
          <div style={{ fontSize: 28, color: "#9698aa" }}>alhassan-portfolio-sigma.vercel.app</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 }}>Alhassan Alfarran</div>
          <div
            style={{
              fontSize: 44,
              marginTop: 20,
              backgroundImage: "linear-gradient(90deg, #a78bfa, #22d3ee)",
              backgroundClip: "text",
              color: "transparent"
            }}
          >
            Software & DevOps Engineer · Web & AI Systems
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 24, color: "#9698aa" }}>
          <span>Next.js</span>·<span>Node.js</span>·<span>AI / RAG</span>·<span>CI/CD</span>·<span>Docker</span>
        </div>
      </div>
    ),
    size
  );
}
