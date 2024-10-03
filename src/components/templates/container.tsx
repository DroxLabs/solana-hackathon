interface IContainerProps {
  className?: string;
  children: React.ReactNode;
}

export default function Container({
  children,
  className,
}: Readonly<IContainerProps>) {
  return <div className={`container ${className}`}>{children}</div>;
}
