"use client";

import { ColumnFiltersState } from "@tanstack/react-table";
import React, { Dispatch, SetStateAction } from "react";

type Props<T> = {
  label: string;
  id: T;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
  status: T;
  setStatus: Dispatch<SetStateAction<T>>;
};

const Tabs = <T,>({
  label,
  id,
  status,
  setStatus,
  setColumnFilters,
}: Props<T>) => {
  const handleTabClick = () => {
    setColumnFilters(() => {
      return [{ id: "fixture", value: id }];
    });
  };

  return (
    <div
      onClick={() => {
        setStatus(id);
        handleTabClick();
      }}
      className={`p-3 text-sm font-medium transition-all cursor-pointer ${
        id === status
          ? "text-primary-foreground/95 underline-tabs"
          : "text-muted-foreground"
      } hover:text-primary-foreground/95`}
    >
      {label}
    </div>
  );
};

export default Tabs;
