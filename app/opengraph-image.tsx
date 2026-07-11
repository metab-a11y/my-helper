import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "my-helper service request marketplace preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#f5f7f8",
          color: "#1f2328",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Arial, Helvetica, sans-serif",
          height: "100%",
          justifyContent: "space-between",
          padding: 64,
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              color: "#0b4f48",
              fontSize: 42,
              fontWeight: 800,
            }}
          >
            my-helper
          </div>
          <div
            style={{
              background: "#f7ece4",
              borderRadius: 999,
              color: "#84431f",
              fontSize: 24,
              fontWeight: 800,
              padding: "12px 22px",
            }}
          >
            Local service leads
          </div>
        </div>

        <div style={{ display: "flex", gap: 36 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 22, width: 690 }}>
            <div
              style={{
                color: "#9b4d22",
                fontSize: 24,
                fontWeight: 800,
                textTransform: "uppercase",
              }}
            >
              Request board + provider leads
            </div>
            <div
              style={{
                fontSize: 76,
                fontWeight: 800,
                letterSpacing: 0,
                lineHeight: 0.98,
              }}
            >
              Find service requests and turn them into paid leads.
            </div>
            <div
              style={{
                color: "#626b75",
                fontSize: 30,
                lineHeight: 1.35,
              }}
            >
              Browse open jobs, create a provider profile, express interest, and unlock requester contact details.
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "2px solid #d8dee4",
              borderRadius: 8,
              display: "flex",
              flexDirection: "column",
              gap: 18,
              padding: 28,
              width: 330,
            }}
          >
            {["Cleaning", "Plumbing", "Tutoring"].map((category, index) => (
              <div
                key={category}
                style={{
                  background: index === 0 ? "#e8f3ef" : "#ffffff",
                  border: "2px solid #d8dee4",
                  borderRadius: 8,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  padding: 18,
                }}
              >
                <div style={{ color: "#84431f", fontSize: 18, fontWeight: 800 }}>
                  {category}
                </div>
                <div style={{ fontSize: 24, fontWeight: 800 }}>
                  {index === 0 ? "Move-out deep clean" : index === 1 ? "Fix kitchen tap" : "Weekly math tutor"}
                </div>
                <div style={{ color: "#626b75", fontSize: 18 }}>
                  Open request
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
