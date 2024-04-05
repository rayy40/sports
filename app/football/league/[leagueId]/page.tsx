"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import Tabs from "@/components/ui/Tabs";
import { detailedTabs } from "@/lib/constants";
import { useLeagueStore } from "@/lib/store";
import { DetailedTabsType, Leagues } from "@/lib/types";
import { getAPIData } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ColumnFiltersState } from "@tanstack/react-table";
import { DropDown } from "@/components/ui/DropDown";

const DetailedLeague = () => {
  const { leagueId } = useParams();
  const { detailedLeague } = useLeagueStore();
  const currSeason =
    detailedLeague?.seasons?.[detailedLeague.seasons.length - 1]?.year.toString;
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [status, setStatus] = useState<DetailedTabsType>("Fixtures");
  const [season, setSeason] = useState<string | undefined>(
    detailedLeague ? currSeason : undefined
  );
  const [leagueData, setLeagueData] = useState<Leagues | null>(detailedLeague);
  const [isInitalDataLoaded, setIsInitalDataLoaded] = useState(
    detailedLeague ? true : false
  );

  const { data, error, isLoading } = useQuery({
    queryKey: [`${leagueId}-Leagues`],
    queryFn: () => getAPIData<Leagues>(`leagues?id=${leagueId}`),
    staleTime: Infinity,
    enabled: detailedLeague ? false : !!leagueId,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data?.response) {
      const currSeason =
        data.response[0].seasons?.[
          data.response[0].seasons.length - 1
        ]?.year.toString();
      setLeagueData(data.response[0]);
      setSeason(currSeason);
      setIsInitalDataLoaded(true);
    }
  }, [data]);

  return (
    <div className="font-sans relative">
      <div className="flex flex-col sticky p-6 pb-0 gap-6 shadow-sm bg-background top-0">
        <div className="flex items-center gap-4">
          <Image
            width={50}
            height={50}
            style={{
              objectFit: "contain",
              borderRadius: "50%",
              aspectRatio: "1/1",
            }}
            className="shadow-team"
            src={leagueData?.league.logo!}
            alt={`${leagueData?.league.name}-logo`}
          />
          <h2 className="font-medium text-2xl">{leagueData?.league.name}</h2>
          <div className="ml-auto">
            <DropDown
              title="seasons"
              data={leagueData?.seasons?.slice().reverse()}
              setValue={setSeason}
              value={season ?? ""}
            />
          </div>
        </div>
        <div className="flex items-end gap-4">
          {detailedTabs.map((tab, index) => (
            <Tabs<DetailedTabsType>
              key={index}
              label={tab.label}
              id={tab.status}
              status={status}
              setStatus={setStatus}
              setColumnFilters={setColumnFilters}
            />
          ))}
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default DetailedLeague;
