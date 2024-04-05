"use client";

import { Dispatch, SetStateAction, useState } from "react";

import { Button } from "@/components/ui/Shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/Shadcn/dropdown-menu";
import { SeasonsEntity } from "@/lib/types";

type Props<T> = {
  title: string;
  data?: SeasonsEntity[] | null;
  value: string;
  setValue: (value: string) => void;
};

export function DropDown<T>({ title, data, value, setValue }: Props<T>) {
  console.log(data);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="capitalize w-28" variant="outline">
          {title}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-[200px] overflow-y-auto w-28">
        <DropdownMenuRadioGroup value={value} onValueChange={setValue}>
          {data?.map((v, index) => (
            <DropdownMenuRadioItem
              className="font-sans font-medium"
              key={index}
              value={v.year.toString()}
            >
              {v.year}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
