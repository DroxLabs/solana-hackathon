import { ButtonSize } from "@/constants";

interface IButtonProps {
  text: string;
  size: ButtonSize;
  className?: string;
}

function Button({ size, text, className }: Readonly<IButtonProps>) {
  const sizes: Record<ButtonSize, string> = {
    [ButtonSize.LARGE]: "btn-text-m lg:btn-text-l",
    [ButtonSize.MEDIUM]: "btn-text-s lg:btn-text-m",
    [ButtonSize.SMALL]: "btn-text-s",
    [ButtonSize.EXTRA_SMALL]: "btn-text-xs",
    [ButtonSize.MAX_EXTRA_SMALL]: "btn-text-xxs",
  };

  const buttonSize = sizes[size] || "";

  return (
    <button
      type="button"
      className={`px-[30px] py-[15px] ${buttonSize} ${className}`.trim()}
    >
      {text}
    </button>
  );
}

export default Button;
