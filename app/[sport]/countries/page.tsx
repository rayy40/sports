import Await from "@/components/Await";
import CountriesWrapper from "@/components/CountriesWrapper";
import Loading from "@/components/Loading";
import { sports } from "@/lib/constants";
import { getCountries } from "@/services/getCountries";
import { Country, Sports } from "@/types/general";
import { Suspense } from "react";

type Props = {
  searchParams: {
    search: string;
  };
  params: {
    sport: Sports;
  };
};

const Page = async ({ params, searchParams }: Props) => {
  if (!sports.includes(params.sport)) {
    throw new Error("Unrecognized sport.");
  }

  const promise = getCountries(params.sport);

  const key = JSON.stringify({ ...params });
  const query = searchParams.search || "";

  return (
    <Suspense key={key} fallback={<Loading />}>
      <Await promise={promise}>
        {({ success, error }) => {
          if (error) {
            throw new Error(error);
          }
          return (
            <div className="flex-1 overflow-y-auto">
              <CountriesWrapper<Country>
                data={success}
                type={"countries"}
                sport={params.sport}
                query={query}
              />
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
};

export default Page;
