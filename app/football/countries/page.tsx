"use client";

import React, { ChangeEvent, useEffect, useState } from "react";

import { Input } from "@/components/ui/Shadcn/input";
import { Country } from "@/types/football";
import BoxList from "@/components/ui/BoxList";
import { useCountries } from "@/services/football/queries";
import { filterSearch } from "@/lib/utils";
import { BounceLoader } from "react-spinners";

const Countries = () => {
  const [country, setCountry] = useState<string>("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [isInitialDataLoaded, setIsInitialDataLoaded] =
    useState<boolean>(false);

  const countriesQuery = useCountries();

  useEffect(() => {
    if (countriesQuery?.data && !isInitialDataLoaded) {
      setCountries(countriesQuery?.data);
      setIsInitialDataLoaded(true);
    }
  }, [countriesQuery, isInitialDataLoaded]);

  const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
    if (countriesQuery?.data) {
      filterSearch(e, countriesQuery?.data, setCountries, setCountry);
    }
  };

  if (countriesQuery?.isError) {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <p>{countriesQuery.error.message}</p>
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen relative">
      <div className="flex sticky p-6 shadow-sm bg-background top-0 items-end justify-between">
        <h2 className="font-medium text-[1.75rem]">Countries</h2>
        <Input
          className="max-w-[300px]"
          value={country}
          type="search"
          onChange={(e) => handleFilter(e)}
          placeholder="Search country"
        />
      </div>
      {countriesQuery?.isFetching || !isInitialDataLoaded ? (
        <div className="flex h-[calc(100vh-90px)] items-center justify-center">
          <BounceLoader color="hsl(45,89%,55%)" />
        </div>
      ) : (
        <div className="grid p-6 pt-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {countries.length > 0 ? (
            countries.map((country, index) => (
              <BoxList
                key={index}
                logo={country?.flag}
                name={country?.name}
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
