import Headline from "@/components/headline";

import { LoadingTableUI } from "@/components/loading-ui";

const Loading = () => {
  return (
    <>
      <Headline>Leave History</Headline>

      <LoadingTableUI columns={6} />
    </>
  );
};

export default Loading;
