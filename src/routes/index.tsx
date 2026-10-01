import { createFileRoute } from "@tanstack/react-router";
import { getHomeData } from "@/lib/server/mongo-voyage";
import { Hero } from "@/components/home/hero";
import { MapVoyage } from "@/components/home/map-voyage";
import {
  About,
  FinalCall,
  Gallery,
  Schedule,
  StoreTeaser,
} from "@/components/home/sections";

export const Route = createFileRoute("/")({
  loader: () => getHomeData(),
  component: Home,
});

function Home() {
  const { site, products, gallery, sessions } = Route.useLoaderData();
  return (
    <>
      <Hero site={site} />
      <MapVoyage />
      <About site={site} />
      <Schedule sessions={sessions} />
      <Gallery items={gallery} />
      <StoreTeaser products={products} />
      <FinalCall site={site} />
    </>
  );
}
