"use client";

import CountriesWrapper from "@/components/CountriesWrapper";
import Loading from "@/components/Loading";
import useCountriesOrLeagues from "@/hooks/useCountriesOrLeagues";
import { Country } from "@/types/general";

const Page = () => {
  const { initialData, value, values, setValue, setValues, isLoading } =
    useCountriesOrLeagues<Country>("countries", "hockey");

  if (isLoading) {
    return (
      <div className="h-screen w-full">
        <Loading />
      </div>
    );
  }

  return (
    <CountriesWrapper<Country>
      initialData={initialData}
      value={value}
      setValue={setValue}
      values={values}
      setValues={setValues}
      type={"countries"}
      sport={"hockey"}
    />
  );
};

export default Page;
