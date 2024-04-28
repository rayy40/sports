"use client";

import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "./Shadcn/drawer";
import { Button } from "./Shadcn/button";
import { ChevronsUpDown } from "lucide-react";
import { DetailedTabsType, FixtureTabsType, Tabs } from "@/types/general";
import { useFixtureTabsStore } from "@/lib/store";

type Props = {
  value?: string;
  values: (Tabs<DetailedTabsType> | FixtureTabsType)[];
  setValue?: (value: DetailedTabsType) => void;
};

const DrawerWrapper = ({ value, values, setValue }: Props) => {
  const { tab, setTab } = useFixtureTabsStore();

  const handleClick = (status: DetailedTabsType | FixtureTabsType) => {
    if (setValue) {
      setValue(status as DetailedTabsType);
    } else {
      setTab(status as FixtureTabsType);
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="w-full mt-1 flex items-center justify-between"
        >
          <p>{value ?? tab}</p>
          <ChevronsUpDown size="15" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="font-sans">
        <div className="mt-4 border-t">
          {values.map((tab) => (
            <DrawerClose
              key={typeof tab !== "string" ? tab.label : tab}
              asChild
            >
              <p
                onClick={() =>
                  handleClick(typeof tab !== "string" ? tab.status : tab)
                }
                className="p-4 cursor-pointer text-sm border-b"
              >
                {typeof tab !== "string" ? tab.label : tab}
              </p>
            </DrawerClose>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerWrapper;
