import React from "react";
import { BounceLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <BounceLoader color="hsl(45,89%,55%)" />
    </div>
  );
};

export default Loading;
