"use client";

import { Dispatch, SetStateAction, SyntheticEvent, useState } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";
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
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/Shadcn/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Shadcn/popover";
import { Column } from "@tanstack/react-table";
import { Filters } from "@/lib/types";
import { X } from "lucide-react";

interface FilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  labels: Filters[];
  title: string;
}

export function FilterDropDown<TData, TValue>({
  column,
  labels,
  title,
}: FilterProps<TData, TValue>) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleRemoveFilter = (e: SyntheticEvent<HTMLElement>) => {
    e.stopPropagation();
    column?.setFilterValue("");
    setOpen(false);
    setSelectedValue("");
  };

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            className="w-[160px] relative justify-start capitalize"
          >
            <p className="max-w-[85%] overflow-hidden text-ellipsis">
              {selectedValue ? selectedValue : `Filter: By ${title}`}
            </p>
            {selectedValue && (
              <span
                onClick={(e: SyntheticEvent<HTMLElement>) =>
                  handleRemoveFilter(e)
                }
                className="w-5 absolute right-2 z-50 ml-auto"
              >
                <X className="w-4 font-bold text-secondary-foreground/40 hover:text-secondary-foreground" />
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[160px] p-0" align="end">
          <StatusList
            setOpen={setOpen}
            labels={labels}
            column={column!}
            setSelectedValue={setSelectedValue}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="secondary"
          className="w-[160px] relative justify-start capitalize"
        >
          <p className="max-w-[85%] overflow-hidden text-ellipsis">
            {selectedValue ? selectedValue : `Filter: By ${title}`}
          </p>
          {selectedValue && (
            <span
              onClick={(e) => handleRemoveFilter(e)}
              className="w-5 absolute right-2 z-50 ml-auto"
            >
              <X className="w-4 font-bold text-secondary-foreground/40 hover:text-secondary-foreground" />
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList
            setOpen={setOpen}
            labels={labels}
            column={column!}
            setSelectedValue={setSelectedValue}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StatusList<TData, TValue>({
  setOpen,
  column,
  labels,
  setSelectedValue,
}: {
  setOpen: (open: boolean) => void;
  setSelectedValue: Dispatch<SetStateAction<string>>;
  column: Column<TData, TValue>;
  labels: Filters[];
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {labels.map((label) => {
            return (
              <CommandItem
                className="text-popover-foreground rounded-md py-2 capitalize"
                key={label.id}
                value={label.name}
                onSelect={() => {
                  column?.setFilterValue(label.id);
                  setSelectedValue(label.name);
                  setOpen(false);
                }}
              >
                {label.name}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
