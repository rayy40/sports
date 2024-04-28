import { Sports } from "@/types/general";
import Link from "next/link";
import React from "react";

const NotFound = ({ type, sport }: { type: string; sport: Sports }) => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <p>No {type} found.</p>
      <Link href={`/${sport}`} className="underline-hover">
        Go back
      </Link>
    </div>
  );
};

export default NotFound;
