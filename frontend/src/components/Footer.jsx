import React from 'react';

const Footer = () => (
  <footer style={{
    width: "100%",
    background: "rgba(15, 23, 42, 0.9)",
    backdropFilter: "blur(20px)",
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    padding: "32px 0 24px 0",
    fontSize: 14,
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    marginTop: 48,
    letterSpacing: 0.5,
    fontWeight: 500,
    zIndex: 10,
    position: "relative"
  }}>
    <div style={{
      maxWidth: 1200,
      margin: "0 auto",
      padding: "0 24px"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8
        }}>
          <div style={{
            fontSize: 20,
            background: "linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)",
            borderRadius: "8px",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            💎
          </div>
          <span style={{
            background: "linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: 700,
            fontSize: 16
          }}>
            FinTrack
          </span>
        </div>
        <div style={{
          fontSize: 13,
          color: "rgba(255, 255, 255, 0.5)"
        }}>
          © {new Date().getFullYear()} FinTrack. All rights reserved.
        </div>
        <div style={{
          display: "flex",
          gap: 16,
          fontSize: 12,
          color: "rgba(255, 255, 255, 0.6)"
        }}>
          <span style={{ cursor: "pointer", transition: "color 0.3s" }}>Privacy</span>
          <span style={{ cursor: "pointer", transition: "color 0.3s" }}>Terms</span>
          <span style={{ cursor: "pointer", transition: "color 0.3s" }}>Support</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;