import type { PropsWithChildren, FC } from "react";
import Navbar from "../components/Navbar";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className=" flex min-h-screen flex-col items-center bg-white px-32 pt-16 text-black">
        {children}
      </main>
    </>
  );
};

export default Layout;
