import { Country, Seasons, Sports, League } from "@/types/general";
import BoxList from "./ui/BoxList";
import { Leagues as FootballLeague } from "@/types/football";
import NotFound from "./NotFound";
import SearchFilter from "./SearchFilter";

type Props<T> = {
  data?: T[];
  type: "league" | "countries";
  sport: Sports;
  query: string;
};

const CountriesWrapper = <
  T extends Country | League<Seasons[]> | FootballLeague
>({
  data,
  type,
  sport,
  query,
}: Props<T>) => {
  if (!data) return <NotFound type={type} />;

  function getName(item: T) {
    return "name" in item ? item.name : item.league.name;
  }

  function getImage(item: T) {
    return "logo" in item
      ? item.logo
      : "flag" in item
      ? item.flag
      : item.league.logo;
  }

  function getUrl(item: T) {
    const id =
      "code" in item ? item.code : "id" in item ? item.id : item.league.id;
    return `/${sport}/${type}/${id}/${type === "league" ? "" : "league"}`;
  }

  const values = data.filter((item) => {
    const searchQuery = query.toLowerCase().replace(/\s/g, "");
    const itemName =
      "name" in item ? item.name.toLowerCase().replace(/\s/g, "") : "";
    const leagueName =
      "league" in item ? item.league.name.toLowerCase().replace(/\s/g, "") : "";
    return itemName.includes(searchQuery) || leagueName.includes(searchQuery);
  });

  return (
    <div className="flex flex-col h-screen font-sans">
      <div className="sticky top-0 flex items-center justify-between p-6 shadow-sm bg-background">
        <h2 className="text-xl font-medium capitalize lg:text-2xl">{type}</h2>
        <SearchFilter />
      </div>
      {values.length > 0 ? (
        <div className="grid flex-1 grid-cols-1 gap-3 p-3 overflow-y-auto lg:p-6 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {values.map((item, index) => {
            return (
              <BoxList
                key={index}
                logo={getImage(item)!}
                name={getName(item)}
                url={getUrl(item)}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <p>No {type} found.</p>
        </div>
      )}
    </div>
  );
};

export default CountriesWrapper;
