import { UsersTable } from "../../components/tables";
import { LoadingAnimation } from "../../components/utils";
import { trpc } from "../../utils/trpc";

const ViewUsers = () => {
  const { data: usersData, isLoading } = trpc.user.getAllUsers.useQuery();

  if (isLoading) {
    return <LoadingAnimation />
  }

  if (!usersData) {
    return <div>No</div>
  }

  return <div className="w-full"><UsersTable users={usersData} /></div>;
};

export default ViewUsers;
