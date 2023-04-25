import { type FC } from "react";
import { useModalState } from "../hooks/modalState";
import { PrimaryButton } from "./utils";

const Modal: FC = () => {
  const { isOpen, closeModal, text, components, onClickName, onClick, width } =
    useModalState((state) => state);

  if (!isOpen) {
    return <></>;
  }

  return (
    <div
      className="fixed bottom-0 left-0 top-0 z-40 flex h-full w-full animate-opacityAnimation items-center justify-center bg-black  bg-opacity-50 backdrop-blur-sm"
      onClick={closeModal}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`ml-20 flex max-h-[650px] min-h-[200px] min-w-[400px] max-w-[1200px] animate-startAnimation flex-col items-center justify-center rounded-lg bg-white p-4 shadow-2xl drop-shadow-xl ${
          width ? "h-full w-full overflow-y-scroll" : ""
        }`}
      >
        <div className=" flex h-full w-full flex-1 flex-col items-center text-center drop-shadow-xl">
          {components ? (
            components
          ) : (
            <div className=" h-full w-full">
              <p>{text}</p>
            </div>
          )}
        </div>
        <div className=" flex w-full items-center justify-end ">
          <div className="  w-1/4 ">
            <PrimaryButton type="button" label="Close" onClick={closeModal} />
          </div>
          {onClickName && onClick ? (
            <div className="  w-1/4">
              <PrimaryButton
                type="button"
                label={onClickName}
                onClick={onClick}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
