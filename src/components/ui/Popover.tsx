"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";

interface PopoverProps {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLButtonElement | null>;
  children: ReactNode;
  className?: string;
  align?: "left" | "right";
}

export function Popover({
  open,
  onClose,
  anchorRef,
  children,
  className = "",
  align = "right",
}: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  const alignClass = align === "right" ? "right-0" : "left-0";

  return (
    <div
      ref={popoverRef}
      className={`absolute top-full mt-2 z-50 ${alignClass} ${className}`}
    >
      <div className="rounded-[--radius-lg] bg-bg-panel border border-border-subtle shadow-[var(--shadow-lifted)] overflow-hidden">
        {children}
      </div>
    </div>
  );
}
