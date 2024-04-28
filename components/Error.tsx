import React from "react";

type Props = {
  message: string | undefined;
};

const Error = ({ message }: Props) => {
  return (
    <div className="flex font-sans font-medium text-red-500 items-center justify-center w-full h-full">
      {message ?? "There's something wrong, please try again after sometime."}
    </div>
  );
};

export default Error;
