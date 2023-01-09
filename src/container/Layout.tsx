import type { PropsWithChildren, FC } from "react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className=" flex min-h-screen flex-col items-center bg-white px-32 pt-16 text-black">
        {children}
      </main>
      <Modal />
    </>
  );
};

export default Layout;
