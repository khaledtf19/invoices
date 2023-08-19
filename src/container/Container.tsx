import { UserRole } from "@prisma/client";
import {
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useState,
} from "react";

import { useUserState } from "../hooks/userDataState";
import { cn } from "../utils/utils";

const Container: FC<
  PropsWithChildren & {
    size?: "max-w-sm" | "max-w-md" | "max-w-lg" | "max-w-xl";
    leftComponent?: ReactNode;
    rightComponent?: ReactNode;
    openLeft?: boolean;
    openRight?: boolean;
  className?: string
  }
> = ({
  children,
  className,
  size,
  leftComponent,
  rightComponent,
  openLeft,
  openRight,
}) => {
  const [leftOpen, setLeftOpen] = useState(openLeft ? openLeft : false);
  const [rightOpen, setRightOpen] = useState(openRight ? openRight : false);

  const { userData } = useUserState()((state) => ({ userData: state.user }));

  return (
    <div className={cn("relative flex w-full items-center justify-center ")}>
      {leftComponent ? (
        <div
          id="container_left"
          className="relative flex  items-center justify-items-center h-5/6"
        >
          {leftOpen ? (
            <div
              className={`absolute flex ${
                userData?.role === UserRole.Admin ? "h-64" : "h-52"
              } w-96 max-w-lg animate-enterFromLeft items-center justify-items-center rounded-r-lg border-y border-gray-400 bg-white  `}
            >
              <div
                onClick={() => {
                  setLeftOpen(!leftOpen);
                }}
                className="rounded-l-l flex h-full items-center justify-center rounded-l-lg bg-blue-900 p-1 text-white "
              >
                {">"}
              </div>
              <div className="h-full w-full">{leftComponent}</div>
            </div>
          ) : (
            <div
              className={`absolute flex ${
                userData?.role === UserRole.Admin ? " h-64" : " h-52"
              } items-center justify-items-center rounded-r-lg  bg-blue-700 p-1 text-white `}
              onClick={() => {
                setLeftOpen(!leftOpen);
              }}
            >
              {"<"}
            </div>
          )}
        </div>
      ) : (
        ""
      )}

      <div
        className={cn(`flex w-full ${
          size ? size : "max-w-md"
        }  z-10 flex-col items-center gap-3 self-center rounded-lg border border-gray-400 bg-white p-4 shadow-2xl drop-shadow-xl`, className) }
      >
        {children}
      </div>

      {rightComponent ? (
        <div
          id="container_right"
          className=" relative flex h-5/6 items-center justify-items-center "
        >
          {rightOpen ? (
            <div
              className={`absolute flex ${
                userData?.role === UserRole.Admin ? " h-64" : " h-52"
              } w-96 max-w-lg animate-enterFromLeft items-center justify-items-center rounded-r-lg border-y border-gray-400 bg-white  `}
            >
              <div className="h-full w-full ">{rightComponent}</div>
              <div
                onClick={() => {
                  setRightOpen(!rightOpen);
                }}
                className="flex h-full items-center justify-center rounded-r-lg bg-red-700 p-1 text-white"
              >
                {"<"}
              </div>
            </div>
          ) : (
            <div
              className={`absolute flex ${
                userData?.role === UserRole.Admin ? " h-64" : " h-52"
              } items-center justify-items-center rounded-r-lg  bg-red-700 p-1 text-white `}
              onClick={() => {
                setRightOpen(!rightOpen);
              }}
            >
              {">"}
            </div>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Container;
