"use client";

import { StatusType } from "@/lib/types";
import { ColumnFiltersState } from "@tanstack/react-table";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  label: string;
  id: StatusType;
  setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
  status: StatusType;
  setStatus: Dispatch<SetStateAction<StatusType>>;
};

const Tabs = ({ label, id, status, setStatus, setColumnFilters }: Props) => {
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
