"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/Shadcn/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex max-w-[60ch] p-4 mx-auto flex-col items-center justify-center w-full h-screen gap-2 font-sans">
      <h2 className="text-lg font-medium text-center text-red-500">
        {error.message ?? "Something went wrong"}
      </h2>
      <Button variant={"outline"} onClick={() => window.location.reload()}>
        Try again
      </Button>
    </div>
  );
}
