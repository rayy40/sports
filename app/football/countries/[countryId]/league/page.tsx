"use client";

import { ChangeEvent, useEffect, useState } from "react";

import { Input } from "@/components/ui/Shadcn/input";
import { League } from "@/lib/types";
import { useParams } from "next/navigation";
import BoxList from "@/components/ui/BoxList";
import { useLeaguesByCountryId } from "@/services/queries";
import { BounceLoader } from "react-spinners";
import { filterSearch, refactorLeagues } from "@/lib/utils";

const Leagues = () => {
  const { countryId } = useParams();
  const [league, setLeague] = useState<string>("");
  const [leagues, setLeagues] = useState<League[]>([]);
  const [isInitialDataLoaded, setIsInitialDataLoaded] =
    useState<boolean>(false);

  const leaguesQuery = useLeaguesByCountryId(countryId);

  useEffect(() => {
    if (leaguesQuery?.data && !isInitialDataLoaded) {
      setLeagues(refactorLeagues(leaguesQuery?.data));
      setIsInitialDataLoaded(true);
    }
  }, [leaguesQuery, isInitialDataLoaded]);

  const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
    if (leaguesQuery.data) {
      const leaguesData: League[] = [];
      leaguesQuery.data.forEach((league) => {
        leaguesData.push(league.league);
      });
      filterSearch(e, leaguesData, setLeagues, setLeague);
    }
  };

  return (
    <div className="font-sans relative">
      <div className="flex sticky p-6 shadow-sm bg-background top-0 items-end justify-between">
        <h2 className="font-medium text-[1.75rem]">Leagues</h2>
        <Input
          className="max-w-[300px]"
          value={league}
          type="search"
          onChange={(e) => handleFilter(e)}
          placeholder="Search league"
        />
      </div>
      {leaguesQuery?.isFetching || !isInitialDataLoaded ? (
        <div className="flex h-[calc(100vh-90px)] items-center justify-center">
          <BounceLoader color="hsl(45,89%,55%)" />
        </div>
      ) : (
        <div className="grid p-6 pt-0 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {leagues.length > 0 ? (
            leagues.map((league, index) => (
              <BoxList
                key={index}
                logo={league.logo}
                name={league.name}
                url={`/football/league/${league.id}`}
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
