import { Sports } from "@/types/general";
import Link from "next/link";
import React from "react";

const NotFound = ({
  type,
  sport,
  ...props
}: {
  type: string;
  sport?: Sports;
}) => {
  return (
    <div {...props} className="flex items-center justify-center w-full h-full">
      <p>No {type} found.</p>
      {sport && (
        <Link href={`/${sport}`} className="underline-hover">
          Go back
        </Link>
      )}
    </div>
  );
};

export default NotFound;
