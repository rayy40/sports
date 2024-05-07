"use client";

import { SyntheticEvent, useEffect, useState } from "react";

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
import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getBaseUrl } from "@/lib/utils";

type FilterProps = {
  labels: string[];
  title: string;
  isTeam?: boolean;
  isReload?: boolean;
};

export function FilterDropDown({
  labels,
  title,
  isTeam = false,
  isReload = false,
}: FilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [leagues, setLeagues] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    if (window !== undefined && isTeam) {
      const baseUrl = getBaseUrl(pathname);
      const leagues = localStorage.getItem(`${baseUrl}-leagues`);
      if (leagues) {
        setLeagues(JSON.parse(leagues));
      }
    }
  }, [pathname, isTeam]);

  const handleRemoveFilter = (e: SyntheticEvent<HTMLElement>) => {
    e.stopPropagation();
    const current = new URLSearchParams(searchParams);

    current.delete(title);

    const search = current.toString();
    const query = search ? `?${search}` : "";

    setSelectedValue("");
    setOpen(false);

    if (isReload) {
      router.push(`${pathname}${query}`);
    } else {
      window.history.pushState(null, "", `${pathname}${query}`);
    }
  };

  const handleSelect = (currentValue: string) => {
    const current = new URLSearchParams(searchParams);
    const value = currentValue.toLowerCase().trim();

    current.set(title, value);

    const search = current.toString();
    const query = search ? `?${search}` : "";

    setSelectedValue(currentValue === selectedValue ? "" : currentValue);
    setOpen(false);

    if (isReload) {
      router.push(`${pathname}${query}`);
    } else {
      window.history.pushState(null, "", `${pathname}${query}`);
    }
  };

  if (isTeam) {
    labels = leagues;
  }

  if (labels.length < 2) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className="w-[160px] text-left hidden lg:block shadow-sm relative justify-start capitalize"
        >
          <p className="max-w-[85%] overflow-hidden text-ellipsis">
            {selectedValue ? selectedValue : `Filter: By ${title}`}
          </p>
          {selectedValue && (
            <span
              onClick={(e: SyntheticEvent<HTMLElement>) =>
                handleRemoveFilter(e)
              }
              className="absolute z-50 w-5 ml-auto -translate-y-1/2 top-1/2 right-2"
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
              {labels.map((label, index) => {
                return (
                  <CommandItem
                    className="py-2 capitalize rounded-md text-popover-foreground"
                    key={index}
                    value={label}
                    onSelect={(currentValue) => handleSelect(currentValue)}
                  >
                    {label}
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
