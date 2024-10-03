import React from "react";
import Image from "next/image";
import INPUT_LEFT_ICON from "@/assets/icons/input-left-vector.webp";
import INPUT_RIGHT_ICON from "@/assets/icons/input-right-vector.webp";

interface IInputProps {
  name: string;
  placeholder: string;
  inputContainerStyles?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function Input(
  { name, placeholder, inputContainerStyles, onChange }: Readonly<IInputProps>,
  ref: React.Ref<HTMLInputElement>
) {
  return (
    <div
      ref={ref}
      className={`lg:w-[40%] md:w-[60%] sm:w-[80%] max-sm:w-[80%] flex items-center ${inputContainerStyles}`}
    >
      <Image
        src={INPUT_LEFT_ICON}
        alt=""
        loading="lazy"
        className="w-[5px] h-[42px]"
      />
      <input
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        className={`border border-[#0A3E50] py-[10px] pl-5 w-full text-[13.5px] font-secondary focus:outline-none`}
        style={{
          color: " rgba(255, 255, 255, 0.60)",
          background: "rgba(10, 43, 65, 0.20)",
        }}
      />
      <Image
        src={INPUT_RIGHT_ICON}
        alt=""
        loading="lazy"
        className="w-[5px] h-[42px]"
      />
    </div>
  );
}

export default React.forwardRef(Input);
