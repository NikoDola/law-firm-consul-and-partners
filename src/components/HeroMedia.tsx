/* eslint-disable @next/next/no-img-element */
import styles from "./HeroMedia.module.css";

function isVideoUrl(url: string) {
  const clean = url.split("?")[0].toLowerCase();
  return clean.endsWith(".mp4") || clean.endsWith(".webm") || clean.endsWith(".ogg");
}

function normalizeMediaUrl(raw: string) {
  // Normalize Windows paths and CMS outputs to valid public URLs.
  const url = raw.trim().replaceAll("\\", "/");
  if (!url) return "";

  // External URLs
  if (/^https?:\/\//i.test(url)) return url;

  // Already absolute
  if (url.startsWith("/")) return url;

  // CMS sometimes stores "public/uploads/..." but Next serves it at "/uploads/..."
  if (url.startsWith("public/")) return `/${url.slice("public/".length)}`;

  // Default: treat as a public-relative path (e.g. "uploads/x.jpg" -> "/uploads/x.jpg")
  return `/${url}`;
}

export default function HeroMedia({
  mediaUrl,
  fallbackVariant = "darkBlue",
}: {
  mediaUrl?: string | null;
  fallbackVariant?: "darkBlue" | "none";
}) {
  const url = normalizeMediaUrl(mediaUrl ?? "");
  const hasMedia = url.length > 0;

  if (!hasMedia) {
    return (
      <div
        className={`${styles.fallback} ${
          fallbackVariant === "darkBlue" ? styles.fallbackDarkBlue : ""
        }`}
        aria-hidden="true"
      />
    );
  }

  if (isVideoUrl(url)) {
    return (
      <div className={styles.media} aria-hidden="true">
        <video
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
    <div className={styles.media} aria-hidden="true">
      {/* Use a plain <img> to avoid remote-domain config surprises. */}
      <img className={styles.image} src={url} alt="" decoding="async" />
      <div className={styles.overlay} />
    </div>
  );
}

