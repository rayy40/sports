import { Timeline } from "@/types/football";
import { Sports } from "@/types/general";
import React from "react";
import ImageWithFallback from "../ImageWithFallback";
import { getPlayByPlayComments } from "@/lib/utils";
import SubstIcon from "@/Assets/Icons/Subst";
import CardIcon from "@/Assets/Icons/YellowOrRedCard";
import { Football } from "@/Assets/Icons/Sports";

type Props = {
  events: Timeline[];
  sport: Sports;
};

const PlayByPlay = ({ events, sport }: Props) => {
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
  return (
    <div className="max-w-[1000px] mx-auto">
      {events.map((event, index) => (
        <div
          className="flex py-6 px-2 border-b items-center gap-10"
          key={index}
        >
          <p className="text-xs text-muted-foreground">
            {event?.time?.elapsed}&#39;
          </p>
          <ImageWithFallback
            width={30}
            height={30}
            src={event.team.logo}
            alt={`${event.team.name}-logo`}
          />
          <p
            className={
              event.type.toLowerCase() === "goal"
                ? "font-semibold"
                : "font-normal"
            }
          >
            {getPlayByPlayComments(event, sport)}
          </p>
          <p className="ml-auto">{renderIcon(event)}</p>
        </div>
      ))}
    </div>
  );
};

export default PlayByPlay;
