import dynamic from "next/dynamic";

const SectionHomeHero = dynamic(
  () => import("@/components/organisms/common/section-home-hero"),
  { ssr: false }
);

export default function Home() {
  return <SectionHomeHero />;
}
