import React from "react";
import BgBlueGlow from "./BgBlueGlow";

const BgStyles = () => {
  return (
    <div className="flex justify-center">
      <div className="absolute z-10 left-0 top-[60vh]">
        <BgBlueGlow />
      </div>

      <div className="absolute z-10 right-0 top-[40vh]">
        <BgBlueGlow />
      </div>
    </div>
  );
};

export default BgStyles;
