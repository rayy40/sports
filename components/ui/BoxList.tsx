import WorldLogo from "@/Assets/Logos/WorldLogo";
import Link from "next/link";
import React from "react";
import ImageWithFallback from "../ImageWithFallback";

type Props = {
  name: string;
  logo: string | undefined;
  url: string;
};

const BoxList = ({ name, logo, url }: Props) => {
  return (
    <Link prefetch={true} href={url}>
      <div className="min-w-[200px] flex gap-8 items-center justify-between p-4 border hover:border-secondary-foreground/30 border-secondary rounded-sm cursor-pointer transition-colors">
        <h3>{name}</h3>
        {logo ? (
          <ImageWithFallback src={logo} alt={name + "-logo"} />
        ) : (
          <WorldLogo />
        )}
      </div>
    </Link>
  );
};

export default BoxList;
