"use client";

import { Button } from "@/components/ui/Shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/Shadcn/dropdown-menu";
import { ButtonVariants } from "@/types/general";

type Props = {
  title: string;
  data?: string[];
  value: string;
  setValue?: (value: string) => void;
  variant?: ButtonVariants;
};

export function DropDown({ title, data, value, variant, setValue }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="capitalize w-[130px] shadow-sm overflow-hidden"
          variant={variant ?? "outline"}
        >
          {title}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-[200px] overflow-y-auto w-[130px]">
        <DropdownMenuRadioGroup value={value} onValueChange={setValue}>
          {data?.map((v, index) => (
            <DropdownMenuRadioItem
              className="font-sans font-medium text-center capitalize"
              key={index}
              value={v}
            >
              {v}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
