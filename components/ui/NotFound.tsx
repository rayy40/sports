import { Sports } from "@/types/general";
import Link from "next/link";
import React from "react";

const NotFound = ({ type, sport }: { type: string; sport?: Sports }) => {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <p>No {type} found.</p>
      <Link href={`/${sport}`} className="underline-hover">
        Go back
      </Link>
    </div>
  );
};

export default NotFound;
