import { League as FootballLeague } from "@/types/football";
import { Country, Seasons, Sports, League } from "@/types/general";
import { useState, useEffect } from "react";

type Props<T> = {
  values: T[];
  setValues: React.Dispatch<React.SetStateAction<T[]>>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  initialData: T[];
  isLoading: boolean;
};

const useCountriesOrLeagues = <
  T extends Country | League<Seasons[]> | FootballLeague
>(
  type: "leagues" | "countries",
  sport: Sports
): Props<T> => {
  const [initialData, setInitialData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [values, setValues] = useState<T[]>([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    const data = window.localStorage.getItem(`${sport}-${type}`);
    if (data) {
      const parsedData = JSON.parse(data);
      setInitialData(parsedData);
      setValues(parsedData);
    }
    setIsLoading(false);
  }, [sport, type]);

  return { values, setValues, value, setValue, initialData, isLoading };
};

export default useCountriesOrLeagues;
