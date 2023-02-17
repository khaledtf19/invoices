import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

import UserPage from "../../components/userPage";

const User = () => {
  const router = useRouter();
  const userId = String(router.query.id);

  const { data: userData, refetch } = trpc.user.getUserById.useQuery({
    id: userId,
  });

  if (!userData) {
    return <h1>can not find this user</h1>;
  }

  return (
    <UserPage
      userData={userData}
      refetch={() => {
        refetch();
      }}
    />
  );
};

export default User;
