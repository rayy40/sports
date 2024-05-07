"use client";

import { Button } from "@/components/ui/Shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/Shadcn/dropdown-menu";
import { ButtonVariants } from "@/types/general";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useState } from "react";

type Props = {
  title: string;
  data?: string[];
  value: string;
  setValue?: (value: string) => void;
  variant?: ButtonVariants;
};

export function DropDown({ title, data, value, variant, setValue }: Props) {
  const [item, setItem] = useState(value);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleValueChange = (e: string) => {
    const current = new URLSearchParams(searchParams);

    current.set(title, e);

    const search = current.toString();
    const query = search ? `?${search}` : "";

    setItem(e);

    router.push(`${pathname}${query}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="capitalize w-[130px] shadow-sm overflow-hidden"
          variant={variant ?? "outline"}
        >
          {title}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-[200px] overflow-y-auto w-[130px]">
        <DropdownMenuRadioGroup
          value={item}
          onValueChange={(e) => handleValueChange(e)}
        >
          {data?.map((v, index) => (
            <DropdownMenuRadioItem
              className="font-sans font-medium text-center capitalize"
              key={index}
              value={v}
            >
              {v}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
