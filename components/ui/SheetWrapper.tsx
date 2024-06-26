"use client";

import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./Shadcn/sheet";
import { Button } from "./Shadcn/button";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Props = {
  query: string;
  title: string;
  labels?: string[];
  filters?: {
    query: string;
    title: string;
    labels: string[];
    isChildren: boolean;
  }[];
  isFooter: boolean;
  isChildren: boolean;
};

const SheetWrapper = ({
  query,
  title,
  labels,
  filters,
  isFooter,
  isChildren,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearchParams = (title: string, value: string) => {
    const current = new URLSearchParams(searchParams);

    current.set(title, value);

    const search = current.toString();
    const query = search ? `${search}` : "";

    return query;
  };

  const removeFilters = () => {
    router.push(pathname);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {isChildren ? (
          <Button className="mt-1 ml-auto" variant={"outline"}>
            <SlidersHorizontal size="15" />
          </Button>
        ) : (
          <Button
            className="flex items-center justify-between w-full p-6 py-8 border-b"
            variant="ghost"
          >
            {title}
            <ArrowRight size="15" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full h-screen p-0 font-sans" side="left">
        <SheetHeader>
          <SheetTitle className="w-full p-6 text-lg text-left capitalize border-b">
            {title}
          </SheetTitle>
        </SheetHeader>
        {filters
          ?.filter((filter) => filter.labels.length > 1)
          .map((filter) => (
            <SheetWrapper
              key={filter.query}
              query={filter.query}
              isChildren={filter.isChildren}
              isFooter={false}
              title={filter.title}
              labels={filter.labels}
            />
          ))}
        {labels && (
          <div className="flex flex-col w-full h-full overflow-y-auto">
            {labels.map((label, index) => (
              <SheetClose asChild key={index}>
                <Link
                  href={
                    query.length > 0
                      ? `?${handleSearchParams(
                          query.toLowerCase(),
                          label.toLowerCase().trim()
                        )}`
                      : `/${label.toLowerCase()}`
                  }
                  className="w-full p-6 text-sm capitalize border-b cursor-pointer"
                >
                  {label}
                </Link>
              </SheetClose>
            ))}
          </div>
        )}
        {isFooter && (
          <SheetFooter className="absolute bottom-0 left-0 w-full">
            <SheetClose asChild>
              <Button
                onClick={removeFilters}
                className="w-full"
                variant="outline"
              >
                Reset Filters
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default SheetWrapper;
