/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";

import { isVideoUrl, normalizePublicAssetUrl } from "@/lib/mediaRouting";

import styles from "./HeroCarousel.module.css";
import mediaStyles from "./HeroMedia.module.css";

export default function HeroCarousel({
  mediaUrls,
}: {
  mediaUrls: string[];
}) {
  const urls = useMemo(
    () => (mediaUrls ?? []).map(normalizePublicAssetUrl).filter(Boolean),
    [mediaUrls]
  );

  const [idx, setIdx] = useState(0);
  const count = urls.length;

  const current = urls[idx] ?? "";
  const isVideo = current ? isVideoUrl(current) : false;

  if (count <= 1) return null;

  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={mediaStyles.media}>
        {isVideo ? (
          <video
            className={mediaStyles.video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            key={current}
          >
            <source src={current} />
          </video>
        ) : (
          <img className={mediaStyles.image} src={current} alt="" decoding="async" />
        )}

        <div className={mediaStyles.overlay} />
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => setIdx((i) => (i - 1 + count) % count)}
          aria-label="Previous"
        >
          ‹
        </button>
        <div className={styles.dots}>
          {urls.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.dot} ${i === idx ? styles.dotActive : ""}`}
              onClick={() => setIdx(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          className={styles.btn}
          onClick={() => setIdx((i) => (i + 1) % count)}
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </div>
  );
}

