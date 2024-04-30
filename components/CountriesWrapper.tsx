import { Country, Seasons, Sports, League } from "@/types/general";
import React, { ChangeEvent } from "react";
import { Input } from "./ui/Shadcn/input";
import BoxList from "./ui/BoxList";
import { filterSearch } from "@/lib/utils";
import { League as FootballLeague } from "@/types/football";

type Props<T> = {
  initialData: T[];
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  values: T[];
  setValues: React.Dispatch<React.SetStateAction<T[]>>;
  type: "league" | "countries";
  sport: Sports;
};

const CountriesWrapper = <
  T extends Country | League<Seasons[]> | FootballLeague
>({
  initialData,
  value,
  values,
  setValue,
  setValues,
  type,
  sport,
}: Props<T>) => {
  const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
    filterSearch(e, initialData, setValues, setValue);
  };

  return (
    <div className="font-sans flex flex-col h-screen">
      <div className="flex sticky p-6 shadow-sm bg-background top-0 items-center justify-between">
        <h2 className="font-medium text-xl lg:text-2xl">Countries</h2>
        <Input
          className="max-w-[200px] lg:max-w-[300px]"
          value={value}
          type="search"
          onChange={(e) => handleFilter(e)}
          placeholder="Search country"
        />
      </div>
      {values.length > 0 ? (
        <div className="grid flex-1 p-3 lg:p-6 overflow-y-auto gap-3 lg:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {values.map((item, index) => (
            <BoxList
              key={index}
              logo={"flag" in item ? item?.flag : item.logo!}
              name={item?.name}
              url={`/${sport}/${type}/${"code" in item ? item.code : item.id}/${
                type === "league" ? "" : "league"
              }`}
            />
          ))}
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <p>No Country found.</p>
        </div>
      )}
    </div>
  );
};

export default CountriesWrapper;
