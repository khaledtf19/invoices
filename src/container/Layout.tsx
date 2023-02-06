import type { PropsWithChildren, FC } from "react";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex w-full flex-row">
      <header>
        <Navbar />
      </header>
      <main className="  flex min-h-screen w-full flex-col items-center bg-white py-5 pl-32 pr-12 text-black">
        {children}
      </main>
      <Modal />
    </div>
  );
};

export default Layout;
