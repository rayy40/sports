"use client";

import CountriesWrapper from "@/components/CountriesWrapper";
import Loading from "@/components/Loading";
import useCountriesOrLeagues from "@/hooks/useCountriesOrLeagues";
import { League, Seasons } from "@/types/general";

const Page = () => {
  const { initialData, value, values, setValue, setValues, isLoading } =
    useCountriesOrLeagues<League<Seasons[]>>("leagues", "baseball");

  if (isLoading) {
    return (
      <div className="h-screen w-full">
        <Loading />
      </div>
    );
  }

  return (
    <CountriesWrapper<League<Seasons[]>>
      initialData={initialData}
      value={value}
      setValue={setValue}
      values={values}
      setValues={setValues}
      type={"league"}
      sport={"baseball"}
    />
  );
};

export default Page;
