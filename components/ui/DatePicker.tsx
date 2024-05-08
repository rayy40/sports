"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "./Shadcn/button";
import { Calendar } from "./Shadcn/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./Shadcn/popover";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { format, parseISO } from "date-fns";

const DatePicker = ({ date }: { date: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSelect = (currentValue?: Date) => {
    if (!currentValue) return;

    const current = new URLSearchParams(searchParams);
    const value = format(currentValue, "yyyy-MM-dd");

    current.set("date", value);

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={
            "w-[140px] h-9 text-sm lg:w-[160px] lg:h-10 justify-center text-center font-medium"
          }
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          {date}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0 font-sans">
        <Calendar
          mode="single"
          selected={parseISO(date)}
          onSelect={(value) => handleSelect(value)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
