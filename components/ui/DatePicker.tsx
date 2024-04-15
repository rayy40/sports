import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "./Shadcn/button";
import { Calendar } from "./Shadcn/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./Shadcn/popover";
import { Dispatch, SetStateAction } from "react";
import { formatDatePattern } from "@/lib/utils";

type Props = {
  date: Date | undefined;
  setDate?: Dispatch<SetStateAction<Date | undefined>>;
};

const DatePicker = ({ date, setDate }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={"w-[200px] justify-center text-center font-medium"}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDatePattern(date) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0 font-sans">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
