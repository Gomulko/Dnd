"use client";

export function HamburgerButton() {
  function toggle() {
    window.dispatchEvent(new CustomEvent("sidebar:toggle"));
  }

  return (
    <button
      className="hamburger-btn"
      onClick={toggle}
      aria-label="Menu"
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 5,
        padding: "4px 8px",
        marginRight: 12,
      }}
    >
      <span style={{ display: "block", width: 22, height: 1.5, background: "#0a0a0a" }} />
      <span style={{ display: "block", width: 22, height: 1.5, background: "#0a0a0a" }} />
      <span style={{ display: "block", width: 22, height: 1.5, background: "#0a0a0a" }} />
    </button>
  );
}
