import { notFound } from "next/navigation";

import type { Country, PracticeArea } from "@/types/content";
import { loadCountries } from "@/lib/loadContent";
import HeroMedia from "@/components/HeroMedia";

import styles from "./PracticeCountryPage.module.css";

export default async function PracticeCountryPage({
  countryId,
  practiceKey,
  practiceLabel,
}: {
  countryId: string;
  practiceKey: "insolvency" | "drivingLicence";
  practiceLabel: string;
}) {
  const countries = await loadCountries("en");
  const country = countries.find((c: Country) => c.id === countryId);
  if (!country) notFound();

  const practice = country[practiceKey] as PracticeArea | undefined;
  if (!practice) notFound();

  const heroUrl = (country.imageUrls?.[0] ?? "").trim();

  return (
    <main>
      <section className={styles.hero}>
        <HeroMedia mediaUrl={heroUrl} />

        <div className={`container ${styles.heroInner}`}>
          <div className={styles.kicker}>{practiceLabel}</div>
          <h1 className={styles.h1}>
            {country.name}
            
          </h1>
        
        </div>
      </section>

      <section className={styles.section}>

        <div className="container">
            {practice.description1 ? (
            <p className={styles.prose}>{practice.description1}</p>
          ) : null}
          <div >
           
            <div className={styles.card}>
              <div className={styles.cardTitle}>Services</div>
              {practice.services?.length ? (
                <ul className={styles.bullets}>
                  {practice.services.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p className={styles.prose}>No services listed yet.</p>
              )}
            </div>

           
          </div>

          {practice.description2 ? (
            <div className={styles.longText}>
              <h2 className={styles.h2}> {practice.headline}</h2>
              <p className={styles.prose}>{practice.description2}</p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

