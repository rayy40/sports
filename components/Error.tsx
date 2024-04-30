import { Sports } from "@/types/general";
import Link from "next/link";
import React from "react";

type Props = {
  message: string | undefined;
  sport?: Sports;
};

const ErrorComponent = ({ message, sport }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-2 font-sans font-medium">
      <p>
        {message ?? "There's something wrong, please try again after sometime."}
      </p>
      {sport && (
        <Link className="font-normal underline-hover" href={`/${sport}`}>
          Go back
        </Link>
      )}
    </div>
  );
};

export default ErrorComponent;
