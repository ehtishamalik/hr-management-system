import React from "react";

import { LoadingTableUI } from "@/components/loading-ui";

const Loading = () => {
  return (
    <section>
      <h1 className="text-2xl font-medium mb-8">Team Overview</h1>

      <LoadingTableUI columns={7} />
    </section>
  );
};

export default Loading;
