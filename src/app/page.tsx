import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold text-red-50 tracking-tight sm:text-[5rem]">
          <span className="text-[hsl(280,100%,70%)]">Pasar Rakyat</span>
        </h1>
        <Link href="/dashboard"><Button>Dashboard</Button></Link>
      </div>
    </main>
  );
}
