import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-2 font-sans">
      <h2 className="font-medium text-lg">Not Found</h2>
      <Link
        className="underline-hover text-secondary-foreground hover:text-foreground"
        href="/"
      >
        Go Home
      </Link>
    </div>
  );
}
