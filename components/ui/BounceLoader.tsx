import React from "react";

const BounceLoader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="size-[50px] lg:size-[60px] relative">
        <div className="w-full h-full rounded-full bg-accent opacity-60 absolute top-0 left-0 animate-bounce-loading"></div>
        <div className="w-full h-full rounded-full bg-accent opacity-60 absolute top-0 left-0 animate-bounce-loading-delay"></div>
      </div>
    </div>
  );
};

export default BounceLoader;
