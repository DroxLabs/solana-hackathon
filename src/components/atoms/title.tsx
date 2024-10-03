import React from "react";
import { TitleSize } from "@/constants";

interface ITitleProps {
  title: string;
  size: TitleSize;
  className?: string;
}

/**
 * Title component renders a heading element with a specified size and title.
 *
 * @param {ITitleProps} props - The properties for the Title component.
 * @param {TitleSize} props.size - The size of the heading element, which determines the HTML tag (e.g., h1, h2).
 * @param {string} props.title - The text content of the heading.
 * @param {string} [props.className] - Optional additional CSS classes to apply to the heading element.
 * @param {React.Ref<HTMLHeadingElement>} [props.ref] - Optional ref to assign to the heading element.
 *
 * @returns {JSX.Element} The rendered heading element.
 */
function Title(
  { size: As, title, className = "" }: Readonly<ITitleProps>,
  ref: React.Ref<HTMLHeadingElement>
) {
  return (
    <As ref={ref} className={`heading-${As} ${className}`.trim()}>
      {title}
    </As>
  );
}

export default React.forwardRef(Title);
