import React from "react";
import ImageWithFallback from "./ImageWithFallback";
import { DropDown } from "./ui/DropDown";

type Props = {
  title: string;
  value: string | null;
  setValue: (season: string | null) => void;
  currValue: string;
  logo?: string | null;
  data: string[];
};

const TabsHeader = ({
  title,
  currValue,
  logo,
  data,
  setValue,
  value,
}: Props) => {
  return (
    <div className="flex items-center gap-4">
      <ImageWithFallback
        width={50}
        height={50}
        src={logo}
        alt={`${title}-logo`}
      />
      <h2 className="flex text-2xl font-medium">
        {title}
        <span className="text-[1rem] ml-3 text-secondary-foreground">
          ({value ?? currValue})
        </span>
      </h2>
      <div className="ml-auto">
        <DropDown
          title="seasons"
          data={data}
          value={currValue}
          setValue={setValue}
        />
      </div>
    </div>
  );
};

export default TabsHeader;
