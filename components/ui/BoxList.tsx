import WorldLogo from "@/Assets/Logos/WorldLogo";
import { Link } from "lucide-react";
import Image from "next/image";
import React from "react";

type Props = {
  name: string;
  flag?: string;
  url: string;
};

const BoxList = ({ name, flag, url }: Props) => {
  return (
    <Link href={url}>
      <div className="min-w-[200px] flex items-center justify-between p-4 border hover:bg-secondary/80 cursor-pointer transition-colors">
        <h3>{name}</h3>
        {flag ? (
          <Image
            loading="lazy"
            width={40}
            height={40}
            style={{
              borderRadius: "50%",
              aspectRatio: "1/1",
              objectFit: "cover",
            }}
            src={flag}
            alt={name}
          />
        ) : (
          <WorldLogo />
        )}
      </div>
    </Link>
  );
};

export default BoxList;
