"use client";

import { Dispatch, SetStateAction, useState } from "react";

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
import { AllTeam } from "@/lib/types";

interface FilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  teams: AllTeam[];
}

export function FilterDropDown<TData, TValue>({
  column,
  teams,
}: FilterProps<TData, TValue>) {
  const [open, setOpen] = useState(false);
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="secondary" className="w-[180px] justify-start">
            By Teams
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[180px] p-0" align="end">
          <Command>
            <CommandInput placeholder="Filter status..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {teams.map((team) => {
                  const isSelected = selectedValues.has(team.name);
                  return (
                    <CommandItem
                      className="text-popover-foreground rounded-md py-2"
                      key={team.id}
                      value={team.name}
                      onSelect={() => {
                        if (isSelected) {
                          selectedValues.delete(team.name);
                        } else {
                          selectedValues.add(team.name);
                        }
                        const filterValues = Array.from(selectedValues);
                        column?.setFilterValue(
                          filterValues.length ? filterValues : undefined
                        );
                        setOpen(false);
                      }}
                    >
                      {team.name}
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

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="secondary" className="w-[180px] justify-start">
          By League
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList setOpen={setOpen} teams={teams} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StatusList({
  setOpen,
  teams,
}: {
  setOpen: (open: boolean) => void;
  teams: AllTeam[];
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {teams.map((status) => {
            return (
              <CommandItem
                className="text-popover-foreground rounded-md"
                key={status.id}
                value={status.name}
                onSelect={(value) => {
                  setOpen(false);
                }}
              >
                {status.name}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
