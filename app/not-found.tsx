import Link from "next/link";

import { Button } from "@/components/ui/button";
import NotFoundImages from "@/components/shared/not-found-images";

interface NotFoundProps {
  backLink: string;
  backLinkText: string;
}

export default function NotFoundComponent({
  backLink,
  backLinkText,
}: NotFoundProps) {
  return (
    <section className="main-content w-full place-content-center px-[var(--margin-x)]">
      <div className="flex flex-col items-center p-6 text-center">
        <NotFoundImages />
        <p className="pt-4 text-xl font-semibold text-slate-800 dark:text-navy-50">
          Oops. This Page Not Found.
        </p>
        <p className="pt-2 text-slate-500 dark:text-navy-200">
          This page you are looking for is only available to authenticated
          users. Please back to home
        </p>
        <Button
          asChild
          className="btn mt-8 h-11 bg-primary text-base font-medium text-white hover:bg-primary-focus hover:shadow-lg hover:shadow-primary/50 focus:bg-primary-focus focus:shadow-lg focus:shadow-primary/50 active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:hover:shadow-accent/50 dark:focus:bg-accent-focus dark:focus:shadow-accent/50 dark:active:bg-accent/90"
        >
          <Link href={backLink}></Link>
        </Button>
      </div>
    </section>
  );
}
