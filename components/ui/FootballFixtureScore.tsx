import { Timeline } from "@/types/football";
import React from "react";

const FootballFixtureScore = ({
  events,
  homeTeam,
}: {
  events: Timeline[];
  homeTeam: number;
}) => {
  const homePlayers = events.filter(
    (event) => event.team.id === homeTeam && event.type.toLowerCase() === "goal"
  );
  const awayPlayers = events.filter(
    (event) => event.team.id !== homeTeam && event.type.toLowerCase() === "goal"
  );
  return (
    <div className="flex px-2 text-xs lg:text-sm justify-between items-start">
      <div className="flex flex-col items-start">
        {homePlayers.map((event, index) => (
          <p key={index} className="capitalize">
            {event.player.name}
            <span className="text-secondary-foreground font-medium ml-3">
              {event.time.elapsed}&#39;
              {event.time.extra && `+ ${event.time.extra}'`}
            </span>
          </p>
        ))}
      </div>
      <div className="flex flex-col items-end">
        {awayPlayers.map((event, index) => (
          <p key={index} className="capitalize">
            {event.player.name}
            <span className="text-secondary-foreground font-medium ml-3">
              {event.time.elapsed}&#39;{" "}
              {event.time.extra && `+ ${event.time.extra}'`}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
};

export default FootballFixtureScore;
