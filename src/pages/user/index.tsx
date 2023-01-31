import { type NextPage } from "next";
import { type PropsWithChildren } from "react";

const ViewUsers: NextPage<PropsWithChildren> = ({ children }) => {
  return <div>1{children}</div>;
};

export default ViewUsers;
