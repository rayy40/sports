import { Lineups as TLineups } from "@/types/football";
import { Sports } from "@/types/general";
import React from "react";

type Props = {
  lineups: TLineups[];
  sport: Sports;
};

const Lineup = ({ lineup, isAway }: { lineup: TLineups; isAway: boolean }) => {
  if (!lineup) return <p>No lineup found.</p>;

  return (
    <div className="w-full space-y-10">
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
            } flex px-4 gap-5 lg:gap-8  text-[0.925rem] lg:text-[1rem] items-center py-4 border-b`}
            key={player?.id}
          >
            {isAway && player?.name}
            <span className="text-sm  text-muted-foreground">
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
            } flex px-4 lg:gap-8 gap-5  text-[0.925rem] lg:text-[1rem] items-center py-4 border-b`}
            key={player?.id}
          >
            {isAway && player?.name}
            <span className="text-sm text-muted-foreground">{player?.pos}</span>
            {!isAway && player?.name}
          </p>
        ))}
      </div>
    </div>
  );
};

const Lineups = ({ lineups, sport }: Props) => {
  return (
    <div className="max-w-[1000px] w-full mx-auto">
      <div className="flex justify-between">
        <Lineup lineup={lineups?.[0]} isAway={false} />
        <Lineup lineup={lineups?.[1]} isAway={true} />
      </div>
    </div>
  );
};

export default Lineups;
