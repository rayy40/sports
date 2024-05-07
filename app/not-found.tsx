import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-2 font-sans">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link className="underline-hover" href="/">
        Go Home
      </Link>
    </div>
  );
}
