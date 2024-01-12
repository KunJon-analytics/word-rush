import { Suspense } from "react";

import { defaultConfig } from "@/config/default";
import { getSession } from "@/actions/session";
import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import getSessionUser from "@/lib/get-session-user";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export default async function DefaultLayout({ children }: DefaultLayoutProps) {
  const session = await getSession();
  const user = getSessionUser(session);

  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback="...">
        <NavBar user={user} items={defaultConfig.mainNav} scroll={true} />
      </Suspense>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
