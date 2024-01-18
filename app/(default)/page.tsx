import Link from "next/link";
import Balancer from "react-wrap-balancer";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import { SignInModal } from "@/components/layout/sign-in-modal";
import { BusinessLine } from "@/components/home/businessline";
import { getActiveRound } from "@/actions/wordle";

export default async function Home() {
  const activeRound = await getActiveRound();
  return (
    <>
      <section className="space-y-6 pb-12 pt-16 lg:py-28">
        <div className="container flex max-w-[64rem] flex-col items-center gap-5 text-center">
          <Link
            href={siteConfig.links.twitter}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "animate-fade-up opacity-0"
            )}
            style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
            target="_blank"
          >
            Introducing on <Icons.twitter className="ml-2 h-4 w-4" />
          </Link>

          <h1
            className="animate-fade-up font-urban text-4xl font-extrabold tracking-tight opacity-0 sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
          >
            <Balancer>
              <span className="relative bg-gradient-to-r from-indigo-500 to-purple-500/80 bg-clip-text font-extrabold text-transparent">
                Word Rush:
              </span>{" "}
              Hunt, Win, Earn Pi Tokens!
            </Balancer>
          </h1>

          <p
            className="max-w-[42rem] animate-fade-up leading-normal text-muted-foreground opacity-0 sm:text-xl sm:leading-8"
            style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
          >
            Embark on an Exciting Journey of Wordplay, Strategy, and Rewards in
            the Ultimate Global Word-Hunting Adventure with Word Rush!
          </p>

          <div
            className="flex animate-fade-up justify-center space-x-2 opacity-0 md:space-x-4"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            {activeRound === "unauthenticated" ? (
              <SignInModal size={"lg"} action={getActiveRound} />
            ) : (
              <Button asChild className="px-3" variant="default" size={"lg"}>
                <Link href={`${activeRound}`}> Play Now!</Link>
              </Button>
            )}

            <Link
              href="https://minepi.com/gshawn"
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "px-4"
              )}
            >
              <Icons.chevrondown className="mr-2 h-4 w-4" />
              <p>Get Pi App!</p>
            </Link>
          </div>
        </div>
      </section>
      <BusinessLine />
    </>
  );
}
