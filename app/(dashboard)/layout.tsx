import { notFound } from "next/navigation";

import { dashboardConfig } from "@/config/dashboard";
import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { getSession } from "@/actions/session";
import getSessionUser from "@/lib/get-session-user";
import { getActiveRound } from "@/actions/wordle";

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await getSession();

  if (!session.isLoggedIn) {
    return notFound();
  }

  const user = getSessionUser(session);

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <NavBar
        user={user}
        items={dashboardConfig.mainNav}
        scroll={false}
        action={getActiveRound}
      />

      {children}
      <SiteFooter className="border-t" />
    </div>
  );
}
