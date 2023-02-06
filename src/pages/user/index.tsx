import LoadingTable from "../../components/tables/LoadingTable";
import { UsersTable } from "../../components/tables/UsersTable";
import { trpc } from "../../utils/trpc";

const ViewUsers = () => {
  const { data: usersData, isLoading } = trpc.user.getAllUsers.useQuery();

  if (isLoading) {
    return <LoadingTable type="small" />;
  }

  if (!usersData) {
    return <div>No</div>;
  }

  return (
    <div className="w-full">
      <UsersTable users={usersData} />
    </div>
  );
};

export default ViewUsers;
