"use client";

import { SyntheticEvent, useState } from "react";

import { Button } from "@/components/ui/Shadcn/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Shadcn/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Shadcn/popover";
import { Column } from "@tanstack/react-table";
import { Filters } from "@/types/general";
import { X } from "lucide-react";

interface FilterProps<TData, TValue> {
  setFilter?: (league: string | null) => void;
  column?: Column<TData, TValue>;
  labels: Filters[];
  title: string;
}

export function FilterDropDown<TData, TValue>({
  setFilter,
  column,
  labels,
  title,
}: FilterProps<TData, TValue>) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const handleRemoveFilter = (e: SyntheticEvent<HTMLElement>) => {
    e.stopPropagation();
    column?.setFilterValue("");
    setFilter?.(null);
    setSelectedValue("");
    setOpen(false);
  };

  const handleSelect = (id: string, currentValue: string) => {
    if (column) {
      column.setFilterValue(id);
    } else if (setFilter) {
      setFilter(currentValue === selectedValue ? null : currentValue);
    }
    setSelectedValue(currentValue === selectedValue ? "" : currentValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className="w-[160px] shadow-sm relative justify-start capitalize"
        >
          <p className="max-w-[85%] overflow-hidden text-ellipsis">
            {selectedValue ? selectedValue : `Filter: By ${title}`}
          </p>
          {selectedValue && (
            <span
              onClick={(e: SyntheticEvent<HTMLElement>) =>
                handleRemoveFilter(e)
              }
              className="absolute z-50 w-5 ml-auto right-2"
            >
              <X className="w-4 font-bold text-secondary-foreground/40 hover:text-secondary-foreground" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[160px] p-0" align="end">
        <Command>
          <CommandInput placeholder="Filter status..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {labels.map((label) => {
                return (
                  <CommandItem
                    className="py-2 capitalize rounded-md text-popover-foreground"
                    key={label.id}
                    value={label.name}
                    onSelect={(currentValue) =>
                      handleSelect(label.id.toString(), currentValue)
                    }
                  >
                    {label.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
