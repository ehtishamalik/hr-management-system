import Headline from "@/components/headline";
import PFSettingsTable from "@/components/pf/settings/pf-settings-table";
import { getAllUsersWithPFStatusQuery } from "@/queries/pf";

const PFSettingsPage = async () => {
  const users = await getAllUsersWithPFStatusQuery();

  return (
    <>
      <Headline>Employee PF Configuration</Headline>
      <PFSettingsTable allUsers={users} />
    </>
  );
};

export default PFSettingsPage;
