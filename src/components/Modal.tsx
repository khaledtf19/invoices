import { type FC } from "react";
import { useModalState } from "../hooks/modalState";

const Modal: FC = () => {
  const { isOpen, closeModal, text, components } = useModalState(
    (state) => state
  );

  if (!isOpen) {
    return <></>;
  }

  return (
    <div
      className="fixed top-0 left-0 bottom-0 flex h-full w-full  items-center justify-center bg-black bg-opacity-50 "
      onClick={closeModal}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="h-full max-h-96 w-full max-w-xl bg-white shadow-2xl drop-shadow-2xl"
      >
        {components ? components : <p>{text}</p>}
      </div>
    </div>
  );
};

export default Modal;
