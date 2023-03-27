import { useSession } from "next-auth/react";
import React from "react";
import { useUserState } from "../../hooks/userDataState";

const Profile = () => {
  const { userData } = useUserState()((state) => ({
    userData: state.user,
  }));

  return <div>{userData?.userBalance}</div>;
};

export default Profile;
