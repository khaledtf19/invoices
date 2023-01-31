import { UserRole } from "@prisma/client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data: sessionData } = useSession();

  return (
    <nav className=" fixed top-0 z-50 flex min-h-[30px] w-full flex-row justify-between bg-indigo-900 px-32 py-2 text-white">
      <ul className="flex w-full flex-row gap-3">
        <li>
          <Link href={"/"}>Home</Link>
        </li>
        <li>
          <Link href={"/profile"}>Profile</Link>
        </li>
        <li>
          <Link href={"/search"}>Search</Link>
        </li>
        {sessionData?.user?.role === UserRole.Admin ? (
          <li>
            <Link href={"/user"}>Users</Link>
          </li>
        ) : null}
      </ul>
      <ul className="flex w-full flex-row justify-end align-middle">
        <li
          className=" rounded-md border border-white px-3 py-[3px]  hover:cursor-pointer hover:bg-indigo-800"
          onClick={sessionData?.user ? () => signOut() : () => signIn()}
        >
          {sessionData?.user ? "Sign out" : "Sign in"}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
