import {
  type PropsWithChildren,
  type FC,
  type ReactNode,
  useState,
} from "react";
import {
  type Invoice,
  type User,
  type Transaction,
  type changeBalance,
  UserRole,
} from "@prisma/client";
import UserData from "./UserData";
import TransactionsTable from "../tables/TransactionsTable";
import ChangeBalanceTable from "../tables/ChangeBalanceTable";

const UserPage: FC<{
  refetch: () => void;
  userData: User & {
    invoices: Invoice[];
    transactions: (Transaction & {
      invoice: {
        id: string;
        createdAt: Date;
        cost: number;
      };
      user: {
        name: string | null;
        email: string | null;
      };
    })[];
    changeBalanceFromAdmin: (changeBalance & {
      admin: { name: string | null; email: string | null } | null;
      user: { name: string | null; email: string | null } | null;
    })[];
    changeBalanceForUser: (changeBalance & {
      admin: { name: string | null; email: string | null } | null;
      user: { name: string | null; email: string | null } | null;
    })[];
  };
}> = ({ userData, refetch }) => {
  return (
    <div className="flex w-full flex-col  justify-center gap-5">
      <UserPageSection name="User info" show={true}>
        <UserData userData={userData} refetch={refetch} />
      </UserPageSection>
      <div className="flex w-full">
        <UserTabs
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
        <div className="flex w-full flex-col items-center justify-center gap-1 rounded-md border border-gray-900  py-10 px-3">
          {children}
        </div>
      </section>
    </div>
  );
};

const UserTabs: FC<{
  tabs: {
    tabName: string;
    component: ReactNode;
  }[];
}> = ({ tabs }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className=" flex w-full flex-col items-center justify-center ">
      <div className=" flex w-full items-start justify-center gap-2">
        {tabs.map((tab, i) => (
          <div
            key={i}
            className=" flex flex-col items-center"
            onClick={() => {
              setSelectedTab(i);
            }}
          >
            <h1 className=" rounded-md bg-gray-900 p-2 text-xl font-bold text-white">
              {tab.tabName}
            </h1>
            {selectedTab === i ? (
              <span className=" h-3 w-3 bg-gray-900 p-1" />
            ) : null}
          </div>
        ))}
      </div>
      <div className="flex w-full items-start justify-center rounded-md border border-gray-900 p-5">
        {tabs[selectedTab]?.component}
      </div>
    </div>
  );
};
