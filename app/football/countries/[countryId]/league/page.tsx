"use client";

import React, { ChangeEvent, useEffect, useState } from "react";

import { Input } from "@/components/ui/Shadcn/input";
import { Leagues } from "@/lib/types";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getAPIData } from "@/lib/utils";
import BoxList from "@/components/ui/BoxList";

const Leagues = () => {
  const { countryId } = useParams();
  const [league, setLeague] = useState<string>("");
  const [leagues, setLeagues] = useState<Leagues[]>([]);
  const [isInitialDataLoaded, setIsInitialDataLoaded] =
    useState<boolean>(false);

  const { data, error, isLoading } = useQuery({
    queryKey: [`${countryId}-Leagues`],
    queryFn: () => getAPIData<Leagues>(`leagues?code=${countryId}`),
    staleTime: Infinity,
    enabled: !!countryId,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data?.response) {
      setLeagues(data.response);
      setIsInitialDataLoaded(true);
    }
  }, [data]);

  const filter = (e: ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const results = data?.response?.filter((league) => {
        return league.league.name
          .toLowerCase()
          .startsWith(keyword.toLowerCase());
      });
      setLeagues(results ?? []);
    } else {
      setLeagues(data?.response ?? []);
    }

    setLeague(keyword);
  };

  return (
    <div className="font-sans relative">
      <div className="flex sticky p-6 shadow-sm bg-background top-0 items-end justify-between">
        <h2 className="font-medium text-[1.75rem]">Leagues</h2>
        <Input
          className="max-w-[300px]"
          value={league}
          type="search"
          onChange={filter}
          placeholder="Search league"
        />
      </div>
      {isLoading || !isInitialDataLoaded ? (
        <div className="flex items-center justify-center">
          <p>Loading...</p>
        </div>
      ) : (
        <div className="grid p-6 pt-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {leagues.length > 0 ? (
            leagues.map((league, index) => (
              <BoxList
                key={index}
                name={league.league.name}
                flag={league.league.logo}
                url={`/football/league/${league.league.name.toLowerCase()}`}
              />
            ))
          ) : (
            <div className="h-[80vh] w-[calc(100vw-32px)] flex items-center justify-center">
              <p>No Leagues found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Leagues;
