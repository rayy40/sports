"use client";

import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "./Shadcn/button";
import { Calendar } from "./Shadcn/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./Shadcn/popover";
import { formatDatePattern } from "@/lib/utils";
import { useDateStore } from "@/lib/store";

const DatePicker = () => {
  const { date, setDate } = useDateStore();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={
            "w-[140px] h-9 text-sm lg:w-[200px] lg:h-10 justify-center text-center font-medium"
          }
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDatePattern(date) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0 font-sans">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
