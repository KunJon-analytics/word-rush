import Image from "next/image";
import React from "react";

const ComingSoon = () => {
  return (
    <div className="min-h-100vh flex grow ">
      <main className="grid w-full grow grid-cols-1 place-items-center">
        <div className="max-w-md p-6 text-center">
          <div className="w-full">
            <Image
              className="w-full"
              src="/images/icons/error-500.svg"
              alt="image"
              width="502"
              height="346"
            />
          </div>
          <p className="pt-4 text-7xl font-bold ">400</p>
          <p className="pt-4 text-xl font-semibold ">Coming Soon</p>
          <p className="pt-2 ">Exciting New Adventure Awaits</p>
        </div>
      </main>
    </div>
  );
};

export default ComingSoon;
