"use client";
import { cn, getBaseUrl } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type Props = {
  id: string;
  leagueId?: string;
  isTeam?: boolean;
};

const Tabs = ({ id, leagueId, isTeam = false }: Props) => {
  const path = usePathname();
  const searchParams = useSearchParams();

  const handleSearchParams = (title: string, value?: string) => {
    if (!isTeam || !value) return;
    const current = new URLSearchParams(searchParams);

    current.set(title, value);

    const search = current.toString();
    const query = search ? `${search}` : "";

    return query;
  };

  const baseURL = getBaseUrl(path);
  const segments = path.split("/");
  const lastSegment = segments[segments.length - 1];

  return (
    <Link
      href={{
        pathname: `${baseURL}/${id.toLowerCase().replaceAll(/\s/g, "-")}`,
        query: handleSearchParams("league", leagueId?.toLowerCase()),
      }}
      className={cn(
        "p-[10px] hidden lg:inline-block text-sm font-medium whitespace-nowrap transition-all cursor-pointer text-muted-foreground hover:text-primary-foreground/95",
        {
          "text-primary-foreground/95 underline-tabs":
            id.toLowerCase().replaceAll(/\s/g, "-") === lastSegment,
        }
      )}
    >
      {id}
    </Link>
  );
};

export default Tabs;
