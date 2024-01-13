"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

const NotFoundImages = () => {
  const { theme } = useTheme();
  return (
    <div className="w-full max-w-xs">
      {theme === "dark" ? (
        <Image
          className="w-full"
          src="/images/icons/error-404-dark.svg"
          alt="image"
          width="402"
          height="260"
        />
      ) : (
        <Image
          className="w-full"
          src="/images/icons/error-404.svg"
          alt="image"
          width="402"
          height="260"
        />
      )}
    </div>
  );
};

export default NotFoundImages;
