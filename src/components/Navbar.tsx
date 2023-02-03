import { UserRole } from "@prisma/client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ReactNode, type FC } from "react";
import { type IconType } from "react-icons";
import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import {
  HiOutlineUserCircle,
  HiUserCircle,
  HiUsers,
  HiOutlineUsers,
} from "react-icons/hi";
import { RiSearchLine, RiSearchFill } from "react-icons/ri";

const Navbar = () => {
  const { data: sessionData } = useSession();

  return (
    <nav className=" fixed top-0 bottom-0 left-0 z-50 flex w-20 flex-col justify-between bg-gradient-to-b from-gray-800 to-gray-900  py-10  text-sm text-white">
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
        {sessionData?.user?.role === UserRole.Admin ? (
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
        <li
          className=" rounded-md border border-white px-1 py-2  text-center hover:cursor-pointer hover:bg-gray-800"
          onClick={sessionData?.user ? () => signOut() : () => signIn()}
        >
          <span>{sessionData?.user ? "Sign out" : "Sign in"}</span>
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
  console.log(router.pathname);

  return (
    <Link
      className={`flex  w-full items-center justify-center ${
        router.pathname.includes(to)
          ? to === "/"
            ? router.pathname === "/"
              ? "bg-gray-900 underline"
              : ""
            : "bg-gray-900 underline"
          : ""
      }  flex-col py-2 underline-offset-4 hover:bg-gray-900 hover:underline`}
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
