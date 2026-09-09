import { ImageResponse } from "next/og"

export const alt = "Prism — a secure workspace for your team"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#111318",
          color: "#f4f4f5",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: "80px",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#a78bfa",
            display: "flex",
            fontSize: 32,
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          PRISM
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            maxWidth: 850,
          }}
        >
          A secure workspace for your team.
        </div>
      </div>
    ),
    size,
  )
}
