import type { Metadata } from "next";

import type { Country } from "@/types/content";
import { loadCountries } from "@/lib/loadContent";
import PracticeCountryPage from "@/components/PracticeCountryPage";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryId: string }>;
}): Promise<Metadata> {
  const { countryId } = await params;
  const countries = await loadCountries("en");
  const country = countries.find((c: Country) => c.id === countryId);

  return {
    title: country
      ? `Insolvency Administration — ${country.name}`
      : "Insolvency Administration",
    description:
      country?.insolvency?.description1 ??
      "Cross-border insolvency coordination and consulting.",
  };
}

export default async function InsolvencyCountryPage({
  params,
}: {
  params: Promise<{ countryId: string }>;
}) {
  const { countryId } = await params;
  return (
    <PracticeCountryPage
      countryId={countryId}
      practiceKey="insolvency"
      practiceLabel="Insolvency Administration"
    />
  );
}

