import Headline from "@/components/headline";

import { getActiveUsers } from "@/services/user";
import { UserManagementTable } from "@/components/user-management-table";

const Users = async () => {
  const users = await getActiveUsers();

  return (
    <>
      <Headline>Employees Management</Headline>
      <UserManagementTable initialUsers={users} />
    </>
  );
};

export default Users;
