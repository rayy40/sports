import React from "react";
import DrawerWrapper from "./ui/DrawerWrapper";
import SheetWrapper from "./ui/SheetWrapper";
import { sports, statusFilters } from "@/lib/constants";

type Props = {
  tabs: string[];
  isHome: boolean;
  isFixture: boolean;
  labels?: string[];
};

const MobileFilter = ({ tabs, labels, isHome, isFixture }: Props) => {
  const filters = [
    {
      query: "",
      title: "More Sports",
      labels: sports,
      isChildren: false,
    },
    {
      query: "status",
      title: "Filter by Status",
      labels: isFixture ? statusFilters : [],
      isChildren: false,
    },
    {
      query: "team",
      title: "Filter by Teams",
      labels: labels ?? [],
      isChildren: false,
    },
  ];

  return (
    <div className="flex w-full gap-3 lg:hidden">
      {isHome ? (
        <p className="p-2 font-medium underline-tabs">Fixtures</p>
      ) : (
        <DrawerWrapper tabs={tabs} />
      )}
      <SheetWrapper
        query="filter"
        isChildren={true}
        isFooter
        title="Filters"
        filters={filters}
      />
    </div>
  );
};

export default MobileFilter;
