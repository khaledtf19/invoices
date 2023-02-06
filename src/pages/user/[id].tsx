import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const User = () => {
  const router = useRouter();
  const userId = String(router.query.id);

  const { data: UserData } = trpc.user.getUserById.useQuery({ id: userId });

  return <div>{userId}</div>;
};

export default User;
