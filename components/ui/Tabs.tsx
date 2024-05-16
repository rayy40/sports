"use client";
import { cn, getBaseUrl } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type Props = {
  id: string;
  leagueId?: string;
  isTeam?: boolean;
  isHome?: boolean;
};

const Tabs = ({ id, leagueId, isTeam = false, isHome = false }: Props) => {
  const path = usePathname();
  const searchParams = useSearchParams();

  const handleSearchParams = (title: string, value?: string) => {
    if (!value) return;
    const current = new URLSearchParams(searchParams);

    current.set(title, value);

    const search = current.toString();
    const query = search ? `${search}` : "";

    return query;
  };

  const baseURL = getBaseUrl(path);
  const status = searchParams.get("status") || "all games";
  const segments = path.split("/");
  const lastSegment = segments[segments.length - 1];

  return (
    <Link
      prefetch={true}
      href={{
        pathname: isHome
          ? path
          : `${baseURL}/${id.toLowerCase().replaceAll(/\s/g, "-")}`,
        query: handleSearchParams(
          isHome ? "status" : "league",
          isHome ? id.toLowerCase() : leagueId?.toLowerCase()
        ),
      }}
      className={cn(
        "p-[10px] hidden lg:inline-block text-sm font-medium whitespace-nowrap transition-all cursor-pointer text-muted-foreground hover:text-primary-foreground/95",
        {
          "text-primary-foreground/95 underline-tabs":
            id.toLowerCase().replaceAll(/\s/g, "-") ===
            (isHome ? status?.replaceAll(/\s/g, "-") : lastSegment),
        }
      )}
    >
      {id}
    </Link>
  );
};

export default Tabs;
