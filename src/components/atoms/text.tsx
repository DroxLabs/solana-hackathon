import React from "react";
import { TextSize } from "@/constants";

interface ITextProps {
  text: string;
  size: TextSize;
  className?: string;
}

/**
 * Text component renders a paragraph element with specified text content and size.
 *
 * @param {ITextProps} props - The properties for the Text component.
 * @param {string} props.text - The text content to be displayed.
 * @param {TextSize} props.size - The size of the text, which determines the CSS classes applied.
 * @param {string} [props.className] - Optional additional CSS classes to apply to the paragraph element.
 * @param {React.Ref<HTMLParagraphElement>} [props.ref] - Optional ref to assign to the paragraph element.
 *
 * @returns {JSX.Element} The rendered paragraph element with the specified text and styling.
 */
function Text(
  { text, size, className = "" }: ITextProps,
  ref: React.Ref<HTMLParagraphElement>
) {
  const sizes: Record<TextSize, string> = {
    [TextSize.LARGE]: "body-text-m lg:body-text-l",
    [TextSize.MEDIUM]: "body-text-s lg:body-text-m",
    [TextSize.SMALL]: "body-text-s",
    [TextSize.EXTRA_SMALL]: "body-text-xs",
    [TextSize.MAX_EXTRA_SMALL]: "body-text-xxs",
  };

  const textSize = sizes[size] || "";

  return (
    <p ref={ref} className={`${textSize} ${className}`.trim()}>
      {text}
    </p>
  );
}

export default React.forwardRef(Text);
