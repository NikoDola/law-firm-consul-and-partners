"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef } from "react";

import styles from "./HeroMedia.module.css";
import { isVideoUrl, normalizePublicAssetUrl } from "@/lib/mediaRouting";

export default function ParallaxHeroMedia({
  mediaUrl,
  fallbackVariant = "darkBlue",
  strength = 0.35,
  maxShift = 120,
}: {
  mediaUrl?: string | null;
  fallbackVariant?: "darkBlue" | "none";
  /** 0..1: smaller = subtler */
  strength?: number;
  /** px clamp */
  maxShift?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const url = useMemo(() => normalizePublicAssetUrl(mediaUrl ?? ""), [mediaUrl]);
  const hasMedia = url.length > 0;
  const isVideo = hasMedia ? isVideoUrl(url) : false;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      // Simple & noticeable: move media relative to how far the hero has scrolled.
      // When the hero top moves up (negative), shift becomes positive.
      const raw = -rect.top * strength;
      const clamped = Math.max(-maxShift, Math.min(maxShift, raw));
      // Drive both image/video via CSS var (more reliable than React state)
      el.style.setProperty("--parallax-y", `${clamped}px`);
      el.style.setProperty("--parallax-scale", "1.12");
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [strength, maxShift]);

  if (!hasMedia) {
    return (
      <div
        ref={containerRef}
        className={`${styles.fallback} ${
          fallbackVariant === "darkBlue" ? styles.fallbackDarkBlue : ""
        }`}
        aria-hidden="true"
      />
    );
  }

  if (isVideo) {
    return (
      <div ref={containerRef} className={styles.media} aria-hidden="true">
        <video
          ref={videoRef}
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={url} />
        </video>
        <div className={styles.overlay} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={styles.media} aria-hidden="true">
      <img className={styles.image} src={url} alt="" decoding="async" />
      <div className={styles.overlay} />
    </div>
  );
}

