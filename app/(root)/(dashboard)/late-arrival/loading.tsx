import Headline from "@/components/headline";

import { LoadingTableUI } from "@/components/loading-ui";

const Loading = () => {
  return (
    <>
      <Headline className="mb-2">Late Arrivals</Headline>
      <Headline type="h4">Your total late arrivals are: ...</Headline>

      <LoadingTableUI columns={4} rows={4} />
    </>
  );
};

export default Loading;
