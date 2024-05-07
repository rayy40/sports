"use client";

import { usePathname, useRouter } from "next/navigation";
import { Input } from "@/components/ui/Shadcn/input";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";

export default function SearchFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState("");
  const [query] = useDebounce(value, 500);

  useEffect(() => {
    if (!query) {
      router.push(pathname);
    } else {
      router.push(`${pathname}?search=${query}`);
    }
  }, [query, router, pathname]);

  return (
    <>
      <Input
        className="max-w-[200px] lg:max-w-[300px]"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search country"
      />
    </>
  );
}
