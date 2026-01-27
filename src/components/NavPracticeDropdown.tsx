import Link from "next/link";
import type { Country } from "@/types/content";

export function NavPracticeDropdown({
  countries,
  label,
  routeBase,
  field,
}: {
  countries: Country[];
  label: string;
  routeBase: string;
  field: "insolvency" | "drivingLicence";
}) {
  const filtered = countries.filter((c) => Boolean(c[field]));

  if (filtered.length === 0) return null;

  return (
    <div className="navDropdown">
      <span className="navDropdownTrigger navLinkDesktop">
        {label}
      </span>

      <div className="navDropdownMenu">
        {filtered.map((country) => (
          <Link
            key={country.id}
            href={`${routeBase}/${country.id}`}
            className="navDropdownItem"
          >
            {country.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
