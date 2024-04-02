import React from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Countries } from "@/lib/types";

type Props = {
  countries: Countries[];
};

const Sidebar = ({ countries }: Props) => {
  const uniqueCountryCodes = new Set();

  return (
    <div className="relative w-full h-full p-4 pr-0 text-foreground">
      <div className="flex font-semibold items-center justify-between select-none">
        <p className="p-3 text-sm uppercase text-foreground/60">Country</p>
        <span className="text-sm cursor-pointer text-foreground/30 underline-hover">
          See More
        </span>
      </div>
      <div>
        <div className="h-[calc(100vh-100px)] overflow-y-auto">
          {countries
            .filter((country) => country.code)
            .map((country) => {
              if (!uniqueCountryCodes.has(country.code)) {
                uniqueCountryCodes.add(country.code);
                return (
                  <div
                    key={country?.code}
                    className="flex items-center w-full gap-3 p-3 transition-colors rounded-md cursor-pointer hover:bg-secondary/40"
                  >
                    <Image
                      loading="lazy"
                      width={27.5}
                      height={27.5}
                      className="object-cover rounded-full aspect-[1/1]"
                      alt={`${country.name}-logo`}
                      src={country.flag}
                    />
                    <p className="max-w-full overflow-hidden whitespace-nowrap text-ellipsis">
                      {country.name}
                    </p>
                    <ChevronRight className="ml-auto text-foreground/40 size-5" />
                  </div>
                );
              }
              return null;
            })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
