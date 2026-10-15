import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-paper px-6 text-center">
      <Logo size={56} />
      <div>
        <p className="font-display text-5xl font-semibold text-ink">404</p>
        <p className="mt-2 text-ink-soft">
          No encontramos esta página en el libro de actas.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Volver a mi panel</Link>
      </Button>
    </main>
  );
}
