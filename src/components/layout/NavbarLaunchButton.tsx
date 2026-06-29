"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function NavbarLaunchButton() {
  const pathname = usePathname();
  const onDashboard = pathname.startsWith("/dashboard");

  if (onDashboard) {
    return (
      <Button size="sm" disabled aria-current="page">
        Launch app
      </Button>
    );
  }

  return (
    <Link href="/dashboard">
      <Button size="sm">Launch app</Button>
    </Link>
  );
}
