"use client";

import { Button } from "@/components/ui/Shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/Shadcn/dropdown-menu";
import { ButtonVariants } from "@/lib/types";

type Props = {
  title: string;
  data?: number[] | string[];
  value: string;
  setValue: (value: string) => void;
  variant?: ButtonVariants;
};

export function DropDown({ title, data, value, setValue, variant }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="capitalize w-[130px]" variant={variant ?? "outline"}>
          {title}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-[200px] overflow-y-auto w-[130px]">
        <DropdownMenuRadioGroup value={value} onValueChange={setValue}>
          {data?.map((v, index) => (
            <DropdownMenuRadioItem
              className="font-sans font-medium capitalize text-center"
              key={index}
              value={v.toString()}
            >
              {v}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
