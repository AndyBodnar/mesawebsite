import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Black Mesa RP - FiveM Roleplay Community";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(249, 115, 22, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(239, 68, 68, 0.15) 0%, transparent 50%)",
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(249, 115, 22, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(249, 115, 22, 0.05) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
          }}
        >
          {/* Logo */}
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "24px",
              background: "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 60px rgba(249, 115, 22, 0.5)",
            }}
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span
              style={{
                fontSize: "72px",
                fontWeight: "bold",
                color: "white",
              }}
            >
              Black Mesa
            </span>
            <span
              style={{
                fontSize: "72px",
                fontWeight: "bold",
                background: "linear-gradient(90deg, #f97316, #ef4444)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              RP
            </span>
          </div>

          {/* Tagline */}
          <p
            style={{
              fontSize: "28px",
              color: "#a1a1aa",
              margin: 0,
            }}
          >
            Experience Immersive Roleplay in Los Santos
          </p>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: "48px",
              marginTop: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "36px",
                  fontWeight: "bold",
                  background: "linear-gradient(90deg, #f97316, #ef4444)",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                500+
              </span>
              <span style={{ fontSize: "16px", color: "#71717a" }}>
                Custom Vehicles
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "36px",
                  fontWeight: "bold",
                  background: "linear-gradient(90deg, #f97316, #ef4444)",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                100+
              </span>
              <span style={{ fontSize: "16px", color: "#71717a" }}>
                Custom Scripts
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "36px",
                  fontWeight: "bold",
                  background: "linear-gradient(90deg, #f97316, #ef4444)",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                24/7
              </span>
              <span style={{ fontSize: "16px", color: "#71717a" }}>
                Active Staff
              </span>
            </div>
          </div>
        </div>

        {/* Server IP */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />
          <span style={{ color: "white", fontSize: "18px" }}>
            connect 5.78.74.196:30120
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
