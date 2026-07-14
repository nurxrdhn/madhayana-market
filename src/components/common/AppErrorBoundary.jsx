import React from "react";

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      message: "",
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message:
        error?.message ||
        "Terjadi kesalahan pada tampilan aplikasi.",
    };
  }

  componentDidCatch(error, info) {
    console.error("APP ERROR:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: "24px",
            background: "#f4f6fa",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <section
            style={{
              width: "min(520px, 100%)",
              padding: "28px",
              borderRadius: "20px",
              background: "#ffffff",
              boxShadow:
                "0 20px 60px rgba(25, 42, 79, 0.14)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              Template gagal ditampilkan
            </h2>

            <p style={{ color: "#667085", lineHeight: 1.7 }}>
              {this.state.message}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                width: "100%",
                minHeight: "48px",
                border: 0,
                borderRadius: "13px",
                color: "#ffffff",
                background: "#175cff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Muat Ulang
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
