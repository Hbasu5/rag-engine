import { memo } from "react";

/**
 * Lightweight atmospheric backdrop.
 * - Pure CSS animations (no Framer Motion, no per-frame React work)
 * - GPU-friendly: animates only transform / opacity
 * - Single composited layer per orb, minimal blur radius
 */
function AuroraBackgroundImpl() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ contain: "strict" }}
    >
      <div className="absolute inset-0 grid-bg opacity-[0.25]" />
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-aurora)", opacity: 0.9 }}
      />

      {/* Two large, slow, GPU-only orbs — no JS animation loop */}
      <div
        className="absolute rounded-full aurora-orb aurora-orb-a"
        style={{
          left: "8%",
          top: "16%",
          width: 420,
          height: 420,
          background:
            "radial-gradient(circle, oklch(0.55 0.22 260 / 0.22), transparent 70%)",
        }}
      />
      <div
        className="absolute rounded-full aurora-orb aurora-orb-b"
        style={{
          right: "6%",
          bottom: "10%",
          width: 480,
          height: 480,
          background:
            "radial-gradient(circle, oklch(0.55 0.22 295 / 0.20), transparent 70%)",
        }}
      />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
    </div>
  );
}

export const AuroraBackground = memo(AuroraBackgroundImpl);
