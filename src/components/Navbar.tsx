import { UserRole } from "@prisma/client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { type FC, type ReactNode } from "react";
import { type IconType } from "react-icons";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import {
  HiOutlineUserCircle,
  HiOutlineUsers,
  HiUserCircle,
  HiUsers,
} from "react-icons/hi";
import { RiSearchLine } from "react-icons/ri";

import { useModalState } from "../hooks/modalState";
import { trpc } from "../utils/trpc";
import CustomerDebtModal from "./customer/CustomerDebtModal";

const Navbar = () => {
  const { data: session } = useSession();
  const { openModal, closeModal, isModalOpen } = useModalState((state) => ({
    isModalOpen: state.isOpen,
    openModal: state.openModal,
    closeModal: state.closeModal,
  }));

  const { data: bankData } = trpc.bank.getBank.useQuery();

  return (
    <nav className=" sticky bottom-0 left-0 top-0 z-50 flex w-20 h-screen flex-col justify-between  rounded-r-lg bg-gradient-to-b from-blue-800  to-blue-900  py-10 text-sm text-white">
      <ul className="flex w-full flex-col gap-3">
        <li>
          <RouteLink
            to={"/"}
            name="Home"
            icon={<IconContainer Icon={AiOutlineHome} />}
            iconActive={<IconContainer Icon={AiFillHome} />}
          />
        </li>
        <li>
          <RouteLink
            to={"/profile"}
            name="Profile"
            icon={<IconContainer Icon={HiOutlineUserCircle} />}
            iconActive={<IconContainer Icon={HiUserCircle} />}
          />
        </li>
        <li>
          <RouteLink
            to={"/search"}
            name="Search"
            icon={<IconContainer Icon={RiSearchLine} />}
            iconActive={<IconContainer Icon={RiSearchLine} />}
          />
        </li>
        {session?.user?.role === UserRole.Admin ? (
          <li>
            <RouteLink
              to={"/user"}
              name="Users"
              icon={<IconContainer Icon={HiOutlineUsers} />}
              iconActive={<IconContainer Icon={HiUsers} />}
            />
          </li>
        ) : null}
      </ul>
      <ul className="flex w-full flex-col justify-end px-1 align-middle">
        <li className=" rounded-md border border-blue-600 px-1 py-2  text-center ">
          {session?.user?.role === UserRole.Admin ? (
            <Link href={`/bank`}>
              <p className=" text-green-600">ADMIN</p>
              {bankData ? (
                <div className="flex flex-col gap-1">
                  <p className="bg-purple-900 py-1 rounded-md">
                    {bankData?.bss}
                  </p>
                  <p className="bg-blue-900 py-1 rounded-md">
                    {bankData?.khadmaty}
                  </p>
                </div>
              ) : (
                ""
              )}
            </Link>
          ) : (
            <p>{session?.user?.userBalance} /EGP</p>
          )}
        </li>
      </ul>
      <ul className="flex w-full flex-col justify-end gap-2 px-1 align-middle">
        {session?.user?.role === UserRole.Admin ? (
          <>
            <li
              className=" rounded-md border border-white bg-red-600 px-1 py-2  text-center transition-colors duration-500 hover:cursor-pointer hover:bg-red-700"
              onClick={() => {
                if (isModalOpen) {
                  closeModal();
                } else {
                  openModal({
                    newComponents: <CustomerDebtModal />,
                    newWidth: "big",
                  });
                }
              }}
            >
              <span>Dept</span>
            </li>
          </>
        ) : (
          ""
        )}

        <li
          className=" rounded-md border border-white bg-blue-700 px-1 py-2 text-center transition-colors duration-500 hover:cursor-pointer hover:bg-blue-800"
          onClick={session?.user ? () => signOut() : () => signIn()}
        >
          <span>{session?.user ? "Sign out" : "Sign in"}</span>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

const RouteLink: FC<{
  to: string;
  name: string;
  icon: ReactNode;
  iconActive: ReactNode;
}> = ({ to, name, icon, iconActive }) => {
  const router = useRouter();

  return (
    <Link
      className={`flex  w-full items-center justify-center ${
        router.pathname.includes(to)
          ? to === "/"
            ? router.pathname === "/"
              ? "bg-blue-900 underline"
              : ""
            : "bg-blue-900 underline"
          : ""
      }  duration-400 flex-col py-2 underline-offset-4 transition-colors hover:bg-blue-900 hover:underline`}
      href={to}
    >
      {router.pathname.includes(to)
        ? to === "/"
          ? router.pathname === "/"
            ? iconActive
            : icon
          : iconActive
        : icon}
      <span className=" ">{name}</span>
    </Link>
  );
};

const IconContainer: FC<{ Icon: IconType }> = ({ Icon }) => {
  return <Icon size={25} name="name" />;
};
