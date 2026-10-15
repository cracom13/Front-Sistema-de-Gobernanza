"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { useWeb3Auth } from "@/hooks/useWeb3Auth";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ResidentManager } from "@/components/admin/resident-manager";
import { ProposalCreator } from "@/components/admin/proposal-creator";

export default function AdminPage() {
  const { user } = useWeb3Auth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "admin") router.replace("/dashboard");
  }, [user, router]);

  if (!user) return null;

  if (user.role !== "admin") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
        <ShieldAlert className="size-8 text-due" />
        <p className="font-display text-xl text-ink">Acceso restringido</p>
        <p className="text-sm text-ink-soft">
          Esta sección es solo para la administración del conjunto.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
      <PageHeader
        title="Administración"
        description="Gestione los propietarios, emita tokens de gobernanza y abra nuevas propuestas para la asamblea."
      />

      <Tabs defaultValue="residents" className="mt-6">
        <TabsList>
          <TabsTrigger value="residents">Residentes y tokens</TabsTrigger>
          <TabsTrigger value="create">Crear propuesta</TabsTrigger>
        </TabsList>
        <TabsContent value="residents">
          <ResidentManager />
        </TabsContent>
        <TabsContent value="create">
          <ProposalCreator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
