import {
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useState,
} from "react";

const Container: FC<
  PropsWithChildren & {
    size?: "max-w-sm" | "max-w-md" | "max-w-lg" | "max-w-xl";
    leftComponent?: ReactNode;
    rightComponent?: ReactNode;
  }
> = ({ children, size, leftComponent, rightComponent }) => {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  return (
    <div className="relative flex w-full items-center justify-center ">
      {leftComponent ? (
        <div
          id="container_left"
          className="relative flex h-5/6 items-center justify-items-center"
        >
          {leftOpen ? (
            <div className="absolute right-0 flex h-80 w-96 max-w-lg animate-enterFromRight items-center justify-items-center rounded-l-lg border-y border-gray-400 bg-white ">
              <div
                onClick={() => {
                  setLeftOpen(!leftOpen);
                }}
                className="rounded-l-l flex h-full items-center justify-center rounded-l-lg bg-blue-900 p-1 text-white "
              >
                {">"}
              </div>
              <div className="h-full w-full overflow-y-scroll">
                {leftComponent}
              </div>
            </div>
          ) : (
            <div
              className="absolute right-0 flex h-80 items-center justify-items-center rounded-l-lg bg-blue-900 p-1 text-white "
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
        className={`flex w-full ${
          size ? size : "max-w-md"
        }  z-10 flex-col items-center gap-3 self-center rounded-lg border border-gray-400 bg-white p-6 shadow-2xl drop-shadow-xl`}
      >
        {children}
      </div>

      {rightComponent ? (
        <div
          id="container_right"
          className=" relative flex h-5/6 items-center justify-items-center "
        >
          {rightOpen ? (
            <div className="absolute flex h-80 w-96 max-w-lg animate-enterFromLeft items-center justify-items-center rounded-r-lg border-y border-gray-400 bg-white  ">
              <div className="h-full w-full overflow-y-scroll">
                {rightComponent}
              </div>
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
              className="absolute flex h-80 items-center justify-items-center rounded-r-lg  bg-red-700 p-1 text-white "
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
