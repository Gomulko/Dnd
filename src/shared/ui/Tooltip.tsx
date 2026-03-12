"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

type Position = "top" | "bottom" | "left" | "right";

type Props = {
  content: React.ReactNode;
  position?: Position;
  children: React.ReactNode;
  delay?: number;
};

const BLACK = "#0a0a0a";
const WHITE = "#ffffff";
const FONT_UI = "var(--font-ui), 'Barlow', system-ui, sans-serif";
const ARROW_SIZE = 6;

type TooltipCoords = {
  top: number;
  left: number;
  arrowTop: number;
  arrowLeft: number;
  arrowBorderTop: string;
  arrowBorderLeft: string;
  arrowBorderRight: string;
  arrowBorderBottom: string;
};

function calcCoords(
  anchor: DOMRect,
  tooltip: DOMRect,
  position: Position
): TooltipCoords {
  const gap = ARROW_SIZE + 4;

  let top = 0;
  let left = 0;
  let arrowTop = 0;
  let arrowLeft = 0;
  let arrowBorderTop = "none";
  let arrowBorderLeft = "none";
  let arrowBorderRight = "none";
  let arrowBorderBottom = "none";

  switch (position) {
    case "top":
      top = anchor.top - tooltip.height - gap + window.scrollY;
      left = anchor.left + anchor.width / 2 - tooltip.width / 2 + window.scrollX;
      arrowTop = tooltip.height;
      arrowLeft = tooltip.width / 2 - ARROW_SIZE;
      arrowBorderTop = `${ARROW_SIZE}px solid ${BLACK}`;
      arrowBorderLeft = `${ARROW_SIZE}px solid transparent`;
      arrowBorderRight = `${ARROW_SIZE}px solid transparent`;
      break;
    case "bottom":
      top = anchor.bottom + gap + window.scrollY;
      left = anchor.left + anchor.width / 2 - tooltip.width / 2 + window.scrollX;
      arrowTop = -ARROW_SIZE * 2;
      arrowLeft = tooltip.width / 2 - ARROW_SIZE;
      arrowBorderBottom = `${ARROW_SIZE}px solid ${BLACK}`;
      arrowBorderLeft = `${ARROW_SIZE}px solid transparent`;
      arrowBorderRight = `${ARROW_SIZE}px solid transparent`;
      break;
    case "left":
      top = anchor.top + anchor.height / 2 - tooltip.height / 2 + window.scrollY;
      left = anchor.left - tooltip.width - gap + window.scrollX;
      arrowTop = tooltip.height / 2 - ARROW_SIZE;
      arrowLeft = tooltip.width;
      arrowBorderLeft = `${ARROW_SIZE}px solid ${BLACK}`;
      arrowBorderTop = `${ARROW_SIZE}px solid transparent`;
      arrowBorderBottom = `${ARROW_SIZE}px solid transparent`;
      break;
    case "right":
      top = anchor.top + anchor.height / 2 - tooltip.height / 2 + window.scrollY;
      left = anchor.right + gap + window.scrollX;
      arrowTop = tooltip.height / 2 - ARROW_SIZE;
      arrowLeft = -ARROW_SIZE * 2;
      arrowBorderRight = `${ARROW_SIZE}px solid ${BLACK}`;
      arrowBorderTop = `${ARROW_SIZE}px solid transparent`;
      arrowBorderBottom = `${ARROW_SIZE}px solid transparent`;
      break;
  }

  // Clamp horizontally so tooltip stays in viewport
  const viewportWidth = window.innerWidth;
  if (left < 8) left = 8;
  if (left + tooltip.width > viewportWidth - 8) left = viewportWidth - tooltip.width - 8;

  return { top, left, arrowTop, arrowLeft, arrowBorderTop, arrowBorderLeft, arrowBorderRight, arrowBorderBottom };
}

export default function Tooltip({ content, position = "top", children, delay = 300 }: Props) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<TooltipCoords | null>(null);
  const [mounted, setMounted] = useState(false);

  const anchorRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateCoords = useCallback(() => {
    if (!anchorRef.current || !tooltipRef.current) return;
    const anchor = anchorRef.current.getBoundingClientRect();
    const tip = tooltipRef.current.getBoundingClientRect();
    setCoords(calcCoords(anchor, tip, position));
  }, [position]);

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => {
      setVisible(true);
    }, delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  }, []);

  // Recalc after visible so we have real tooltip dimensions
  useEffect(() => {
    if (visible) {
      // Small rAF to let the DOM render the tooltip first
      requestAnimationFrame(() => updateCoords());
    }
  }, [visible, updateCoords]);

  const tooltip = (
    <div
      ref={tooltipRef}
      role="tooltip"
      style={{
        position: "absolute",
        top: coords?.top ?? -9999,
        left: coords?.left ?? -9999,
        zIndex: 9999,
        maxWidth: 280,
        background: BLACK,
        color: WHITE,
        fontFamily: FONT_UI,
        fontSize: 12,
        lineHeight: 1.55,
        padding: "10px 14px",
        borderRadius: 0,
        pointerEvents: "none",
        opacity: visible && coords ? 1 : 0,
        transform: visible && coords ? "translateY(0)" : "translateY(4px)",
        transition: "opacity 0.15s ease, transform 0.15s ease",
        whiteSpace: "normal",
      }}
    >
      {content}
      {/* Arrow */}
      {coords && (
        <span
          style={{
            position: "absolute",
            top: coords.arrowTop,
            left: coords.arrowLeft,
            width: 0,
            height: 0,
            borderTop: coords.arrowBorderTop,
            borderLeft: coords.arrowBorderLeft,
            borderRight: coords.arrowBorderRight,
            borderBottom: coords.arrowBorderBottom,
          }}
        />
      )}
    </div>
  );

  return (
    <>
      <span
        ref={anchorRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        style={{ display: "inline-flex", alignItems: "center" }}
      >
        {children}
      </span>
      {mounted && createPortal(tooltip, document.body)}
    </>
  );
}
