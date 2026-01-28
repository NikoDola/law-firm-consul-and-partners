import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Country } from "@/types/content";
import { loadCountries, loadPages } from "@/lib/loadContent";
import ParallaxHeroMedia from "@/components/ParallaxHeroMedia";
import { mediaForLocation, mediaForPage } from "@/lib/mediaRouting";
import HeroCarousel from "@/components/HeroCarousel";

import styles from "./content-page.module.css";

export const dynamic = "force-dynamic";

function routeFromSlug(slug: string[]) {
  return `/${slug.join("/")}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pages = await loadPages("en");
  const route = routeFromSlug(slug);
  const page = pages.find((p) => p.route === route);
  if (!page) return {};

  return {
    title: page.metaTitle || page.headline1,
    description: page.metaDescription || page.description1,
  };
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const route = routeFromSlug(slug);

  const pages = await loadPages("en");
  const page = pages.find((p) => p.route === route);
  if (!page) notFound();

  const countries = await loadCountries("en");
  const relatedCountries = (page.countries ?? [])
    .map((id) => countries.find((c: Country) => c.id === id))
    .filter(Boolean) as Country[];

  const locationCountries =
    route === "/location"
      ? countries.filter((c) => {
          const city = (c.city ?? "").trim();
          const address = (c.address ?? "").trim();
          const desc = (c.addressDescription ?? "").trim();
          return Boolean(city && address && desc);
        })
      : [];

  return (
    <main>
      <section className={styles.hero}>
        {mediaForPage(page.imageUrl).length > 1 ? (
          <HeroCarousel mediaUrls={mediaForPage(page.imageUrl)} />
        ) : (
          <ParallaxHeroMedia mediaUrl={mediaForPage(page.imageUrl)[0] ?? ""} />
        )}

        <div className={`container ${styles.heroInner}`}>
          <h1 className={styles.h1}>{page.headline1}</h1>
          <p className={styles.lede}>{page.description1}</p>
        </div>
      </section>

      <section
        className={`${styles.section} ${
          route === "/location" ? styles.locationSection : ""
        }`}
      >
        <div className="container">
          {page.headline2 ? <h2 className={styles.h2}>{page.headline2}</h2> : null}

          {Array.isArray(page.services) && page.services.length > 0 ? (
            <ul className={styles.bullets}>
              {page.services.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          ) : null}

          {page.description2 ? <p className={styles.prose}>{page.description2}</p> : null}

          {route === "/location" && locationCountries.length > 0 ? (
            <div className={styles.locationGrid}>
              {locationCountries.map((c) => (
                <div key={c.id} className={styles.locationCard}>
                  <div className={styles.locationMedia} aria-hidden="true">
                    {mediaForLocation(c.imageUrls)?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className={styles.locationImg}
                        src={mediaForLocation(c.imageUrls)[0]}
                        alt=""
                        decoding="async"
                      />
                    ) : null}
                  </div>

                  <div className={styles.locationTop}>
                    <span className={styles.locationIcon} aria-hidden="true">
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 22s7-6.2 7-13a7 7 0 1 0-14 0c0 6.8 7 13 7 13Z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                        <path
                          d="M12 12.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                      </svg>
                    </span>

                    <div className={styles.locationTitleBlock}>
                      <h3 className={styles.locationCountry}>
                        {c.headOffice ? `${c.name} Head Office` : `${c.name} Office`}
                      </h3>
                      <p className={styles.locationCity}>{c.city}</p>
                    </div>
                  </div>

                  <div className={styles.locationDesc}>{c.addressDescription}</div>
                  <div className={styles.locationAddress}>{c.address}</div>
                </div>
              ))}
            </div>
          ) : null}

          {page.headline3 ? <h2 className={styles.h2}>{page.headline3}</h2> : null}
          {page.description3 ? <p className={styles.prose}>{page.description3}</p> : null}

          {relatedCountries.length > 0 ? (
            <div className={styles.related}>
              <h3 className={styles.h3}>Related locations</h3>
              <div className={styles.countryGrid}>
                {relatedCountries.map((c) => (
                  <div key={c.id} className={styles.countryCard}>
                    <div className={styles.countryName}>{c.name}</div>
                    {c.city ? (
                      <div className={styles.countryMeta}>
                        {c.city}
                        {c.jurisdiction ? ` · ${c.jurisdiction}` : ""}
                      </div>
                    ) : c.jurisdiction ? (
                      <div className={styles.countryMeta}>{c.jurisdiction}</div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

