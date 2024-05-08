import React from "react";
import BounceLoader from "@/components/ui/BounceLoader";

const Loading = () => {
  return (
    <div className="w-full h-screen">
      <BounceLoader />
    </div>
  );
};

export default Loading;
