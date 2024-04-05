"use client";

import React, { ChangeEvent, useEffect, useState } from "react";

import { Input } from "@/components/ui/Shadcn/input";
import { Country } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getAPIData } from "@/lib/utils";
import BoxList from "@/components/ui/BoxList";

const Countries = () => {
  const [country, setCountry] = useState<string>("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [isInitialDataLoaded, setIsInitialDataLoaded] =
    useState<boolean>(false);

  const { data, error, isLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getAPIData<Country>("countries"),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data?.response) {
      setCountries(data.response);
      setIsInitialDataLoaded(true);
    }
  }, [data]);

  const filter = (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const results = data?.response?.filter((country) => {
        return country.name.toLowerCase().startsWith(keyword.toLowerCase());
      });
      setCountries(results ?? []);
    } else {
      setCountries(data?.response ?? []);
    }

    setCountry(keyword);
  };

  return (
    <div className="font-sans relative">
      <div className="flex sticky p-6 shadow-sm bg-background top-0 items-end justify-between">
        <h2 className="font-medium text-[1.75rem]">Countries</h2>
        <Input
          className="max-w-[300px]"
          value={country}
          type="search"
          onChange={filter}
          placeholder="Search country"
        />
      </div>
      {isLoading || !isInitialDataLoaded ? (
        <div className="flex items-center justify-center">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="grid p-6 pt-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {countries.length > 0 ? (
            countries.map((country, index) => (
              <BoxList
                key={index}
                name={country.name}
                flag={country.flag}
                url={`/football/countries/${country.code}/league`}
              />
            ))
          ) : (
            <div className="h-[80vh] w-[calc(100vw-32px)] flex items-center justify-center">
              <p>No Country found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Countries;
