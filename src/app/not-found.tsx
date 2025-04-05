import Link from "next/link";

export default function NotFound() {
  return (
    <div className="lg:col-span-9 md:col-span-9">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
