import type { FC, PropsWithChildren } from "react";

const Container: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-3 self-center rounded-lg border border-gray-400 p-6 shadow-2xl drop-shadow-xl">
      {children}
    </div>
  );
};

export default Container;
