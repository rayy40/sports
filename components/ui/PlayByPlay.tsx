import { Timeline } from "@/types/football";
import { Sports } from "@/types/general";
import React, { useMemo } from "react";
import ImageWithFallback from "../ImageWithFallback";
import {
  getFootballPlayByPlayComments,
  getHockeyPlayByPlayComments,
  getNFLPlayByPlayComments,
  groupEventsByPeriods,
} from "@/lib/utils";
import SubstIcon from "@/Assets/Icons/Subst";
import CardIcon from "@/Assets/Icons/YellowOrRedCard";
import { Football } from "@/Assets/Icons/Sports";
import { HockeyEvents } from "@/types/hockey";
import { NFLEvents } from "@/types/american-football";

type Props = {
  events: (Timeline | HockeyEvents | NFLEvents)[];
  sport: Sports;
};

const renderIcon = (event: Timeline) => {
  switch (event.type.toLowerCase()) {
    case "goal":
      return <Football width={20} height={20} />;
    case "card":
      if (event.detail.toLowerCase() === "yellow card")
        return <CardIcon width={20} height={25} color={"#f8ce26"} />;
      else if (event.detail.toLowerCase() === "red card")
        return <CardIcon width={18} height={23} color={"#ff4466"} />;
      else return null;
    case "subst":
      return <SubstIcon width={20} height={25} />;
    default:
      return null;
  }
};

const Event = ({
  event,
  sport,
}: {
  event: HockeyEvents | Timeline | NFLEvents;
  sport: Sports;
}) => {
  return (
    <div className="flex py-3 lg:py-6 px-2 border-b items-center gap-5 lg:gap-10">
      <p className="text-xs text-muted-foreground min-w-[30px]">
        {"minute" in event ? event?.minute : `${event?.time?.elapsed}'`}
      </p>
      <ImageWithFallback
        className="w-[25px] lg:w-[30px]"
        src={event.team.logo}
        alt={`${event.team.name}-logo`}
      />
      <p
        className={
          sport === "football" && event.type.toLowerCase() === "goal"
            ? "font-semibold text-sm lg:text-[1rem]"
            : "font-normal text-sm lg:text-[1rem]"
        }
      >
        {sport === "football" &&
          getFootballPlayByPlayComments(event as Timeline)}
        {sport === "hockey" &&
          getHockeyPlayByPlayComments(event as HockeyEvents)}
        {sport === "american-football" &&
          getNFLPlayByPlayComments(event as NFLEvents)}
      </p>
      {sport === "football" && (
        <p className="text-sm lg:text-[1rem] ml-auto">
          {renderIcon(event as Timeline)}
        </p>
      )}
    </div>
  );
};

const PlayByPlay = ({ events, sport }: Props) => {
  const eventsByPeriods = useMemo(
    () =>
      sport !== "football" &&
      groupEventsByPeriods(events as (HockeyEvents | NFLEvents)[]),
    [events, sport]
  );

  return (
    <div className="max-w-[1000px] w-full mx-auto">
      {eventsByPeriods &&
        Object.keys(eventsByPeriods).map((period) => (
          <div key={period}>
            <div className="capitalize px-2 text-sm text-secondary-foreground py-4 lg:py-6 border-b">
              {period}
            </div>
            {eventsByPeriods[period].map((event, index) => (
              <Event key={index} event={event} sport={sport} />
            ))}
          </div>
        ))}
      {sport === "football" &&
        events.map((event, index) => (
          <Event key={index} event={event} sport={sport} />
        ))}
    </div>
  );
};

export default PlayByPlay;
