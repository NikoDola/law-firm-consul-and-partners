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
    title: country ? `EU Driving Licence — ${country.name}` : "EU Driving Licence",
    description:
      country?.drivingLicence?.description1 ??
      "Driving licence consulting across EU jurisdictions.",
  };
}

export default async function DrivingLicenceCountryPage({
  params,
}: {
  params: Promise<{ countryId: string }>;
}) {
  const { countryId } = await params;
  return (
    <PracticeCountryPage
      countryId={countryId}
      practiceKey="drivingLicence"
      practiceLabel="EU Driving Licence"
    />
  );
}

