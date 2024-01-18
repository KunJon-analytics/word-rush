import React from "react";
import { notFound } from "next/navigation";

import Stats from "@/components/dashboard/stats";
import { RecentRounds } from "@/components/dashboard/recent-rounds";
import { getMe } from "@/actions/me";
import { NoTokensAlert } from "@/components/shared/no-tokens";

const DashboardPage = async () => {
  const me = await getMe();
  if (!me) {
    notFound();
  }
  return (
    <main className="grid grid-cols-1 place-content-start w-full px-10 pb-8">
      <div className="mt-4 grid grid-cols-12 gap-4 sm:mt-5 sm:gap-5 lg:mt-6 lg:gap-6">
        <div className="col-span-12 space-y-4 sm:space-y-5 lg:col-span-8 lg:space-y-6">
          {me.tokens < 1 && <NoTokensAlert />}
          <Stats me={me} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-1 lg:gap-6">
            <RecentRounds me={me} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
