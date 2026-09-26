import { ImageResponse } from "next/og";
import { projects, getProject } from "@/lib/projects";

export const alt = "Project case study — Alhassan Alfarran, Software Engineer (Web & AI Systems)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** One image per project, generated at build time. */
export function generateStaticParams() {
  return projects.map((item) => ({ slug: item.slug }));
}

export default async function ProjectOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return new Response("Not found", { status: 404 });

  const { title, rolePurpose: subtitle } = project;
  const tech = project.tech.slice(0, 5);
  const titleSize = title.length > 34 ? 60 : title.length > 22 ? 72 : 84;

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
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 26, color: "#ececf3", fontWeight: 600 }}>Alhassan Alfarran</div>
              <div style={{ fontSize: 20, color: "#9698aa" }}>Software Engineer — Web & AI Systems</div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px 20px",
              borderRadius: 999,
              border: "1px solid rgba(167, 139, 250, 0.4)",
              background: "rgba(167, 139, 250, 0.1)",
              color: "#ddd6fe",
              fontSize: 20,
              letterSpacing: "0.18em",
              textTransform: "uppercase"
            }}
          >
            Case study
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: titleSize, fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.05 }}>{title}</div>
          <div
            style={{
              fontSize: 36,
              marginTop: 22,
              backgroundImage: "linear-gradient(90deg, #a78bfa, #22d3ee)",
              backgroundClip: "text",
              color: "transparent"
            }}
          >
            {subtitle}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {tech.map((item) => (
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
