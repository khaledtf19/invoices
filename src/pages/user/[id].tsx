import { useRouter } from "next/router";

const User = () => {
  const router = useRouter();
  const id = String(router.query.id);
  return <div>{id}</div>;
};

export default User;
