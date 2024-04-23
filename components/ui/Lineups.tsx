import { Lineups } from "@/types/football";
import { Sports } from "@/types/general";
import React from "react";

type Props = {
  lineups: Lineups[];
  sport: Sports;
};

const Lineup = ({ lineup, isAway }: { lineup: Lineups; isAway: boolean }) => {
  if (!lineup) return <p>No lineup found.</p>;

  return (
    <div className="space-y-10 w-full">
      <div>
        <p
          className={`${
            isAway ? "text-right" : "text-left"
          } font-medium px-4 border-b py-4 uppercase text-xs text-secondary-foreground`}
        >
          Starters
        </p>
        {lineup.startXI?.map(({ player }) => (
          <p
            className={`${
              isAway ? "justify-end" : "justify-start"
            } flex px-4 gap-8 items-center py-4 border-b`}
            key={player?.id}
          >
            {isAway && player?.name}
            <span className=" text-[0.875rem] text-muted-foreground">
              {player?.pos}
            </span>
            {!isAway && player?.name}
          </p>
        ))}
      </div>
      <div>
        <p
          className={`${
            isAway ? "text-right" : "text-left"
          } font-medium px-4 border-b py-4 uppercase text-xs text-secondary-foreground`}
        >
          Substitutes
        </p>
        {lineup.substitutes?.map(({ player }) => (
          <p
            className={`${
              isAway ? "justify-end" : "justify-start"
            } flex px-4 gap-8 items-center py-4 border-b`}
            key={player?.id}
          >
            {isAway && player?.name}
            <span className="text-[0.875rem] text-muted-foreground">
              {player?.pos}
            </span>
            {!isAway && player?.name}
          </p>
        ))}
      </div>
    </div>
  );
};

const Lineups = ({ lineups, sport }: Props) => {
  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="flex justify-between">
        <Lineup lineup={lineups?.[0]} isAway={false} />
        <Lineup lineup={lineups?.[1]} isAway={true} />
      </div>
    </div>
  );
};

export default Lineups;
