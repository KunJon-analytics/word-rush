import React from "react";

import Preloader from "@/components/shared/preloader";

const Loading = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <Preloader />
    </div>
  );
};

export default Loading;
