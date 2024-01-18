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
    <section className="h-screen flex items-center justify-center w-full place-content-center px-[var(--margin-x)]">
      <div className="flex flex-col items-center p-6 text-center">
        <NotFoundImages />
        <p className="pt-4 text-xl font-semibold ">
          Oops. This Page Not Found.
        </p>
        <p className="pt-2 ">
          This page you are looking for is not available. Please go back to home
        </p>
        <Button asChild className="btn mt-8 h-11 text-base font-medium ">
          <Link href={backLink}>{backLinkText}</Link>
        </Button>
      </div>
    </section>
  );
}
