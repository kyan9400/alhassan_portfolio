import { ImageResponse } from "next/og";

export const alt = "Alhassan Alfarran — Full-Stack & Python Developer. Moscow · Available immediately";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const STACK = ["React", "TypeScript", "Node.js", "Python / FastAPI", "RAG & search"];

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
          background:
            "radial-gradient(circle at 15% 10%, #3b1d7a 0%, transparent 45%), radial-gradient(circle at 90% 90%, #0e4d5c 0%, transparent 45%), #0a0a0f",
          color: "#ececf3",
          fontFamily: "sans-serif"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
            <div style={{ fontSize: 26, color: "#9698aa" }}>alhassan-portfolio-sigma.vercel.app</div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 20px",
              borderRadius: 999,
              border: "1px solid rgba(74, 222, 128, 0.35)",
              background: "rgba(74, 222, 128, 0.08)",
              color: "#bbf7d0",
              fontSize: 22
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: 999, background: "#4ade80" }} />
            Moscow · Available immediately
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 }}>Alhassan Alfarran</div>
          <div
            style={{
              fontSize: 46,
              marginTop: 22,
              backgroundImage: "linear-gradient(90deg, #a78bfa, #22d3ee)",
              backgroundClip: "text",
              color: "transparent"
            }}
          >
            Full-Stack & Python Developer
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {STACK.map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                padding: "10px 20px",
                borderRadius: 999,
                border: "1px solid rgba(255, 255, 255, 0.12)",
                background: "rgba(255, 255, 255, 0.04)",
                color: "#c4c6d6",
                fontSize: 22
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
