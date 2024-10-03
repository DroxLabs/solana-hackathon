import Container from "./container";

interface ISectionProps {
  className?: string;
  children: React.ReactNode;
}

export default function Section({
  children,
  className,
}: Readonly<ISectionProps>) {
  return <Container className={className}>{children}</Container>;
}
