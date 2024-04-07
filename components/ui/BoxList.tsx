import WorldLogo from "@/Assets/Logos/WorldLogo";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  name: string;
  logo: string | undefined;
  url: string;
};

const BoxList = ({ name, logo, url }: Props) => {
  return (
    <Link href={url}>
      <div className="min-w-[200px] flex gap-8 items-center justify-between p-4 border hover:bg-secondary/80 cursor-pointer transition-colors">
        <h3>{name}</h3>
        {logo ? (
          <Image
            loading="lazy"
            width={40}
            height={40}
            style={{
              borderRadius: "50%",
              aspectRatio: "1/1",
              objectFit: "cover",
            }}
            src={logo}
            alt={name + "-logo"}
          />
        ) : (
          <WorldLogo />
        )}
      </div>
    </Link>
  );
};

export default BoxList;
