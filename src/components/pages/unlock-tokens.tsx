import dynamic from "next/dynamic";

const SectionUnlockTokens = dynamic(
  () => import("@/components/organisms/unlock-tokens"),
  { ssr: false }
);

export default function UnlockTokens() {
  return <SectionUnlockTokens />;
}
