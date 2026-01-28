import Link from "next/link";

import type { Service } from "@/types/content";
import { loadPages, loadServices } from "@/lib/loadContent";
import HeroMedia from "@/components/HeroMedia";

import styles from "./home.module.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  const pages = await loadPages("en");
  const services = await loadServices("en");

  const homePage = pages.find((p) => p.isHome);
  if (!homePage) return null;

  return (
    <main>
      <section className={styles.hero}>
        <HeroMedia mediaUrl={homePage.imageUrl} />

        <div className={`container ${styles.heroInner}`}>
          <div className={styles.kicker}>International Legal Consulting</div>
          <h1 className={styles.h1}>{homePage.headline1}</h1>
          <p className={styles.lede}>{homePage.description1}</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          {homePage.headline2 ? (
            <h2 className={styles.h2}>{homePage.headline2}</h2>
          ) : null}
          {homePage.description2 ? (
            <p className={styles.prose}>{homePage.description2}</p>
          ) : null}
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className="container">
          {homePage.headline3 ? (
            <h2 className={styles.h2}>{homePage.headline3}</h2>
          ) : null}

          <div className={styles.cards}>
            {services.map((s: Service) => (
              <Link key={s.id} href={`/services/${s.id}`} className={styles.card}>
                <div className={styles.cardTitle}>{s.title}</div>
                <div className={styles.cardBody}>{s.description}</div>
                <div className={styles.cardCta}>Learn more</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
