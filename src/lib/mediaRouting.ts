export function normalizePublicAssetUrl(raw: string) {
  let url = (raw ?? "").trim().replaceAll("\\", "/");
  if (!url) return "";

  // Some CMS/inputs use "-mp4" instead of ".mp4"
  url = url.replace(/-mp4$/i, ".mp4");
  url = url.replace(/-webm$/i, ".webm");
  url = url.replace(/-ogg$/i, ".ogg");

  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return url;

  // If it starts with public/, map to the correct public URL.
  // If it was saved as "public/<filename>" (no folder), assume it belongs in /uploads/.
  if (url.startsWith("public/")) {
    const rest = url.slice("public/".length);
    if (!rest.includes("/")) return `/uploads/${rest}`;
    return `/${rest}`;
  }

  // If it is a bare filename, assume it belongs in /uploads/.
  if (!url.includes("/")) return `/uploads/${url}`;

  return `/${url}`;
}

export function isVideoUrl(url: string) {
  const clean = url.split("?")[0].toLowerCase();
  return clean.endsWith(".mp4") || clean.endsWith(".webm") || clean.endsWith(".ogg");
}

function matchesLocation(url: string) {
  return /location/i.test(url);
}

function matchesInsolvency(url: string) {
  return /insolvenc/i.test(url);
}

function matchesDrivingLicence(url: string) {
  // Accept common filename variants
  return /driving[-_ ]?licen[cs]e/i.test(url);
}

type MediaTag = "address" | "insolvency" | "drivingLicence";

function tagsForUrl(url: string): MediaTag[] {
  const tags: MediaTag[] = [];
  // NOTE: keep "address" tag name for backward compatibility in code that
  // treats this bucket as "location-related media".
  if (matchesLocation(url)) tags.push("address");
  if (matchesInsolvency(url)) tags.push("insolvency");
  if (matchesDrivingLicence(url)) tags.push("drivingLicence");
  return tags;
}

function isUntagged(url: string) {
  return tagsForUrl(url).length === 0;
}

export function mediaForLocation(imageUrls: string[] | undefined) {
  const urls = (imageUrls ?? []).map(normalizePublicAssetUrl).filter(Boolean);
  // Only use images/videos explicitly tagged for location.
  // If none exist, show no location image.
  const location = urls.filter(matchesLocation);
  return location;
}

export function mediaForPractice(
  imageUrls: string[] | undefined,
  practiceKey: "insolvency" | "drivingLicence"
) {
  const urls = (imageUrls ?? []).map(normalizePublicAssetUrl).filter(Boolean);
  if (practiceKey === "insolvency") {
    const items = urls.filter(matchesInsolvency);
    // If insolvency-tagged media exists, use ONLY it.
    // Otherwise, use only untagged media (so driving-licence-tagged videos/images never leak here).
    return items.length ? items : urls.filter(isUntagged);
  }
  const items = urls.filter(matchesDrivingLicence);
  // Same rule for driving licence pages.
  return items.length ? items : urls.filter(isUntagged);
}

export function mediaForPage(imageUrl: string | string[] | undefined | null) {
  const rawList = Array.isArray(imageUrl) ? imageUrl : imageUrl ? [imageUrl] : [];
  return rawList.map(normalizePublicAssetUrl).filter(Boolean);
}

