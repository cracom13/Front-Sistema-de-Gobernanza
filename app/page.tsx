"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWeb3Auth } from "@/hooks/useWeb3Auth";

export default function IndexPage() {
  const { status, user } = useWeb3Auth();
  const router = useRouter();

  useEffect(() => {
    if (status === "initializing" || status === "connecting") return;
    if (status === "connected" && user) {
      router.replace(user.onboardingComplete ? "/dashboard" : "/onboarding");
    } else {
      router.replace("/login");
    }
  }, [status, user, router]);

  return null;
}
