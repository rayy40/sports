"use client";

import CountriesWrapper from "@/components/CountriesWrapper";
import Loading from "@/components/Loading";
import useCountriesOrLeagues from "@/hooks/useCountriesOrLeagues";
import { League } from "@/types/football";

const Page = () => {
  const { initialData, value, values, setValue, setValues, isLoading } =
    useCountriesOrLeagues<League>("leagues", "basketball");

  if (isLoading) {
    return (
      <div className="h-screen w-full">
        <Loading />
      </div>
    );
  }

  return (
    <CountriesWrapper<League>
      initialData={initialData}
      value={value}
      setValue={setValue}
      values={values}
      setValues={setValues}
      type={"league"}
      sport={"basketball"}
    />
  );
};

export default Page;
