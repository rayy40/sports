"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SiteLogo from "@/Assets/Logos/SiteLogo";
import React from "react";
import {
  Baseball,
  Basketball,
  Football,
  Hockey,
  NFL,
  Rugby,
} from "@/Assets/Icons/Sports";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/Shadcn/tooltip";

const Navbar = () => {
  const path = usePathname();
  const currSport = `/${path.split("/")[1]}`;

  const sports = [
    {
      icon: <Football width={30} height={30} />,
      name: "football",
      link: "/football",
    },
    {
      icon: <NFL width={30} height={30} />,
      name: "AFL",
      link: "/american-football",
    },
    {
      icon: <Basketball width={30} height={30} />,
      name: "basketball",
      link: "/basketball",
    },
    {
      icon: <NFL width={30} height={30} />,
      name: "NFL",
      link: "/australian-football",
    },
    {
      icon: <Baseball width={30} height={30} />,
      name: "baseball",
      link: "/baseball",
    },
    { icon: <Rugby width={30} height={30} />, name: "rugby", link: "/rugby" },
    {
      icon: <Hockey width={30} height={30} />,
      name: "hockey",
      link: "/hockey",
    },
  ];

  return (
    <div className="sticky top-0 left-0 z-50 flex-col items-center justify-between hidden w-16 h-screen p-6 font-sans border shadow-sm lg:flex bg-background">
      <Link
        href={"/"}
        className={`rounded-full ${
          currSport === "/"
            ? "bg-accent/40 border border-accent shadow-team"
            : "hover:bg-accent/30 transition-all opacity-60 hover:opacity-100"
        }`}
      >
        <div className="s-[40px] rounded-full flex items-center justify-center overflow-hidden p-1 mt-2">
          <SiteLogo width={40} height={40} />
        </div>
      </Link>
      {sports.map((sport, index) => (
        <Link
          key={index}
          href={sport.link}
          className={`rounded-full ${
            currSport === sport.link
              ? "bg-accent/40 border border-accent shadow-team"
              : "hover:bg-accent/30 transition-all opacity-60 hover:opacity-100"
          }`}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="w-[40px] h-[40px] rounded-full flex items-center justify-center overflow-hidden p-2 mt-2">
                  {sport.icon}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="capitalize">{sport.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Link>
      ))}
    </div>
  );
};

export default Navbar;
