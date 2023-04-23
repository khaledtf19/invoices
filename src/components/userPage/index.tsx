import { type PropsWithChildren, type FC } from "react";
import { UserRole } from "@prisma/client";
import UserData from "./UserData";
import TransactionsTable from "../tables/TransactionsTable";
import ChangeBalanceTable from "../tables/ChangeBalanceTable";
import { type RouterOutputs } from "../../utils/trpc";
import { PageTabs } from "../utils";

const UserPage: FC<{
  refetch: () => void;
  userData: RouterOutputs["user"]["getUserById"];
}> = ({ userData, refetch }) => {
  if (!userData) {
    return <></>;
  }

  return (
    <div className="flex w-full flex-col  justify-center gap-5">
      <UserPageSection name="User info" show={true}>
        <UserData userData={userData} refetch={refetch} />
      </UserPageSection>
      <div className="flex w-full">
        <PageTabs
          tabs={[
            {
              tabName: "User Transactions",
              component: (
                <TransactionsTable transactions={userData.transactions} />
              ),
            },
            {
              tabName: "User Balance",
              component: (
                <ChangeBalanceTable
                  changeBalance={
                    userData.role === UserRole.Admin
                      ? userData.changeBalanceFromAdmin
                      : userData.changeBalanceForUser
                  }
                />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default UserPage;

const UserPageSection: FC<
  PropsWithChildren & { name: string; show: boolean }
> = ({ children, name }) => {
  return (
    <div className=" flex flex-col">
      <section className="relative flex w-full flex-col items-center justify-center ">
        <h1 className=" rounded-md bg-gray-900 p-2 text-xl font-bold text-white">
          {name}
        </h1>
        <span className=" h-3 w-3 bg-gray-900 p-1" />
        <div className="flex w-full flex-col items-center justify-center gap-1 rounded-md border border-gray-900  px-3 py-10">
          {children}
        </div>
      </section>
    </div>
  );
};
