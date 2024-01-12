import Image from "next/image";
import React from "react";
import Link from "next/link";
import { Gamepad2 } from "lucide-react";

import { Button } from "../ui/button";

const Hero = () => {
  return (
    <section className="pb-12 h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#E8E3F5] via-[#EDEAFB] to-[#F7FAFC]">
      <div className="items-center pt-12 px-8 mx-auto max-w-7xl lg:px-16 md:px-12">
        <div className="justify-center w-full text-center lg:p-10 max-auto">
          <div className="justify-center w-full mx-auto">
            <div className="flex flex-col items-center justify-center max-w-xl gap-3 mx-auto lg:flex-row">
              <Image
                alt="hero"
                className="w-32 h-32 rounded-full border border-[#E8E3F4]"
                src="/images/icons/hero.png"
                width={189}
                height={181}
              />
            </div>

            <p className="mt-4 sm:px-32 text-[#10172A] sm:text-xl text-sm font-semibold tracking-tighter">
              by @Koyiana 🤖
            </p>

            <p className="sm:mt-8 mt-3 sm:px-44 text-[#10172A] text-4xl sm:text-6xl font-semibold tracking-tighter">
              Unlock{" "}
              <span className="underline leading-8 underline-offset-8 decoration-8 decoration-[#8b5cf6]">
                Pi Tokens
              </span>{" "}
              Every Hour.
            </p>

            <p className="sm:mt-8 mt-2.5 text-[#10172A] sm:px-72  sm:leading-loose text-lg font-normal tracking-tighter">
              Word Rush: Hunt, Earn, Repeat!
              <span className="font-semibold"> Find </span>
              hidden <span className="font-semibold">words</span> every hour to
              <span className="font-semibold"> claim Pi </span>tokens instantly.
              Join now for language fun and crypto rewards!{" "}
            </p>
          </div>
        </div>
      </div>

      <div className="text-center space-x-4 mt-6 lg:mt-0">
        <Button
          asChild
          className="bg-[#8B5CF6] translate-y-1 text-[#fff] sm:text-lg text-xs font-bold py-2.5 px-6  rounded-full inline-flex items-center"
        >
          <Link href="/dashboard/play">
            <Gamepad2 className="w-6 h-6" />
            &nbsp; &nbsp;<span> Join the Challenge </span>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Hero;
