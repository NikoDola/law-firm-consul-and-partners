import NavBarClient from "@/components/NavBarClient";
import { loadCountries, loadPages } from "@/lib/loadContent";

export default async function NavBar() {
  const pages = await loadPages("en");
  const countries = await loadCountries("en");

  return <NavBarClient pages={pages} countries={countries} />;
}
