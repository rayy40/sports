import { Timeline } from "@/types/football";
import { Sports } from "@/types/general";
import React, { useMemo } from "react";
import ImageWithFallback from "../ImageWithFallback";
import {
  getFootballPlayByPlayComments,
  getHockeyPlayByPlayComments,
  groupEventsByPeriods,
} from "@/lib/utils";
import SubstIcon from "@/Assets/Icons/Subst";
import CardIcon from "@/Assets/Icons/YellowOrRedCard";
import { Football } from "@/Assets/Icons/Sports";
import { HockeyEvents } from "@/types/hockey";

type Props = {
  events: (Timeline | HockeyEvents)[];
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
  event: HockeyEvents | Timeline;
  sport: Sports;
}) => {
  return (
    <div className="flex py-6 px-2 border-b items-center gap-10">
      <p className="text-xs text-muted-foreground">
        {"minute" in event ? event?.minute : `${event?.time?.elapsed}'`}
      </p>
      <ImageWithFallback
        width={30}
        height={30}
        src={event.team.logo}
        alt={`${event.team.name}-logo`}
      />
      <p
        className={
          sport === "football" && event.type.toLowerCase() === "goal"
            ? "font-semibold"
            : "font-normal"
        }
      >
        {sport === "football" &&
          getFootballPlayByPlayComments(event as Timeline)}
        {sport === "hockey" &&
          getHockeyPlayByPlayComments(event as HockeyEvents)}
      </p>
      {sport === "football" && (
        <p className="ml-auto">{renderIcon(event as Timeline)}</p>
      )}
    </div>
  );
};

const PlayByPlay = ({ events, sport }: Props) => {
  const eventsByPeriods = useMemo(
    () => sport === "hockey" && groupEventsByPeriods(events as HockeyEvents[]),
    [events, sport]
  );

  return (
    <div className="max-w-[1000px] mx-auto">
      {eventsByPeriods &&
        Object.keys(eventsByPeriods).map((period) => (
          <div key={period}>
            <div className="capitalize px-2 text-sm text-secondary-foreground py-6 border-b">
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
