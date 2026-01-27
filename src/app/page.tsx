import pages from "@/data/en/pages.json";
import type { Page } from "@/types/content";
import services from "@/data/en/services.json";
import type { Service } from "@/types/content";

const typedPages = pages as Page[];



const homePage = pages[0]


export default function Home() {
  return (
    <main>
      <h1>{homePage.headline1}</h1>
      <p style={{whiteSpace: "pre-line"}}>{homePage.description1}</p>

      {services.map((item: Service) => (
        <p key={item.id}>{item.id}</p>
      ))}
    </main>
  );
}
