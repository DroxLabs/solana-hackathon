import React from "react";

interface Props {
  children: React.ReactNode;
  outerColorClass?: string;
  innerColorClass?: string;
  borderColorClass?: string;
}
const BorderWrapper = ({
  children,
  outerColorClass = "bg-primary-wallet",
  innerColorClass = "bg-primary-wallet",
  borderColorClass = "border-primary-wallet",
}: Props) => {
  return (
    <>
      <div className="flex flex-row relative items-center">
        <div className="absolute left-0 top-0 bottom-0  flex-row flex ">
          <div className="h-full flex items-center">
            <div className={`h-[60%] w-1 ${outerColorClass}`} />
          </div>
          <div className=" flex flex-col items-end">
            <div className={`h-1 w-2 ${innerColorClass}`} />
            <div className={`h-full w-1 ${innerColorClass}`} />
            <div className={`h-1 w-2 ${innerColorClass}`} />
          </div>
        </div>
        <div
          className={`ml-3 mr-3 w-fit h-fit border ${borderColorClass} relative z-10`}
        >
          {children}
        </div>
        <div className="absolute right-0 top-0 bottom-0  flex-row flex ">
          <div className=" flex flex-col">
            <div className={`h-1 w-2 ${innerColorClass}`} />
            <div className={`h-full w-1 ${innerColorClass}`} />
            <div className={`h-1 w-2 ${innerColorClass}`} />
          </div>
          <div className="h-full flex items-center">
            <div className={`h-[60%] w-1 ${outerColorClass}`} />
          </div>
        </div>
      </div>
    </>
  );
};

export default BorderWrapper;
