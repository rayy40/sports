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
import { usePathname } from "next/navigation";
import { getBaseUrl } from "@/lib/utils";
import Link from "next/link";

type Props = {
  tabs: string[];
};

const DrawerWrapper = ({ tabs }: Props) => {
  const path = usePathname();
  const baseURL = getBaseUrl(path);
  const segments = path.split("/");
  const lastSegment = segments[segments.length - 1];

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center justify-between w-full mt-1"
        >
          <p className="capitalize">{lastSegment}</p>
          <ChevronsUpDown size="15" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="font-sans">
        <div className="flex flex-col mt-4 border-t">
          {tabs?.map((tab) => (
            <DrawerClose key={tab} asChild>
              <Link
                href={`${baseURL}/${tab.toLowerCase().replaceAll(/\s/g, "-")}`}
                className="p-4 text-sm border-b cursor-pointer"
              >
                {tab}
              </Link>
            </DrawerClose>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerWrapper;
