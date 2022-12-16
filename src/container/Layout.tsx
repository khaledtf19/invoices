import type { PropsWithChildren, FC } from "react";
import Navbar from "../components/Navbar";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className=" min-h-screen bg-white px-32 pt-12 text-black">
        {children}
      </main>
    </>
  );
};

export default Layout;
