import { useSession } from "next-auth/react";
import React from "react";

const Profile = () => {
  const { data: userData } = useSession();

  return <div>{userData?.user?.userBalance}</div>;
};

export default Profile;
