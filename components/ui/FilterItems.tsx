"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Shadcn/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/Shadcn/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Shadcn/popover";
import { Filters } from "@/types/football";

type Props = {
  data: Filters[];
  title: string;
  setFilter: Dispatch<SetStateAction<string | null>>;
};

export function FilterItems({ data, title, setFilter }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <span className="max-w-[95%] overflow-hidden text-ellipsis ">
            {value
              ? data.find(
                  (data) => data.name.toLowerCase() === value.toLowerCase()
                )?.name
              : title}
          </span>
          {value ? (
            <X
              onClick={(e) => {
                e.stopPropagation();
                setFilter(null);
                setValue("");
              }}
              className="w-4 font-bold text-secondary-foreground/40 hover:text-secondary-foreground"
            />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search data..." />
          <CommandEmpty>No data found.</CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-y-auto">
            {data.map((data) => (
              <CommandItem
                key={data.id}
                value={data.name}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setFilter(currentValue === value ? null : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === data.name ? "opacity-100" : "opacity-0"
                  )}
                />
                {data.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
