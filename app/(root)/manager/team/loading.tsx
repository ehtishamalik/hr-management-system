import Headline from "@/components/headline";

import { LoadingTableUI } from "@/components/loading-ui";

const Loading = () => {
  return (
    <>
      <Headline>Team Overview</Headline>
      <LoadingTableUI columns={5} rows={3} />

      <Headline type="h3" className="mb-4">
        Upcoming Leaves
      </Headline>
      <LoadingTableUI columns={7} rows={3} />
    </>
  );
};

export default Loading;
