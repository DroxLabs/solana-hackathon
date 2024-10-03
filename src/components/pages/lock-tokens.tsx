import dynamic from "next/dynamic";

const SectionLockTokens = dynamic(
  () => import("@/components/organisms/lock-tokens/section-lock-tokens"),
  { ssr: false }
);

export default function LockTokens() {
  return <SectionLockTokens />;
}
