"use client";

import { useStatusStore, useTabsStore } from "@/lib/store";
import { DetailedTabsType, StatusType } from "@/types/general";
import { ColumnFiltersState } from "@tanstack/react-table";
import React, { Dispatch, SetStateAction } from "react";

type Props<T> = {
  label: string;
  id: T;
  setColumnFilters?: Dispatch<SetStateAction<ColumnFiltersState>>;
  isStatus: boolean;
};

const Tabs = <T,>({
  label,
  id,
  setColumnFilters,
  isStatus = true,
}: Props<T>) => {
  const { status, setStatus } = useStatusStore();
  const { tab, setTab } = useTabsStore();
  const handleTabClick = () => {
    if (isStatus) {
      setStatus(id as StatusType);
    } else {
      setTab(id as DetailedTabsType);
    }
    if (setColumnFilters) {
      setColumnFilters(() => {
        return [{ id: "fixture", value: id }];
      });
    }
  };

  return (
    <div
      onClick={handleTabClick}
      className={`p-3 text-sm font-medium transition-all cursor-pointer ${
        id === (isStatus ? status : tab)
          ? "text-primary-foreground/95 underline-tabs"
          : "text-muted-foreground"
      } hover:text-primary-foreground/95`}
    >
      {label}
    </div>
  );
};

export default Tabs;
