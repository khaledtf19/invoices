import { type ReactNode } from "react";
import { create } from "zustand";

interface ModalStateType {
  isOpen: boolean;
  text: string;
  components?: ReactNode;
  onClick?: () => void;
  onClickName?: string;
  width?: "big" | "normal";
  changeIsOpen: () => void;
  changeText: (newText: string) => void;
  changeOnClick: (newOnclick: () => void) => void;
  changeComponent: ({newComponent}: {newComponent: ReactNode})=> void,
  openModal: (prams: {
    newOnclick?: () => void;
    newText?: string;
    newComponents?: ReactNode;
    newWidth?: "big" | "normal";
  }) => void;
  closeModal: () => void;
}

export const useModalState = create<ModalStateType>((set) => ({
  isOpen: false,
  text: "",
  components: undefined,
  onClick: undefined,
  onClickName: "",
  width: undefined,
  changeIsOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  changeText: (newText) => set(() => ({ text: newText })),
  changeOnClick: (newOnclick) => set(() => ({ onClick: newOnclick })),
  changeComponent: ({newComponent})=> set(()=> ({components: newComponent})),
  openModal: ({ newOnclick, newText, newComponents, newWidth }) =>
    set(() => ({
      text: newText,
      onClick: newOnclick,
      isOpen: true,
      components: newComponents,
      width: newWidth,
    })),
  closeModal: () =>
    set(() => ({
      text: "",
      onClick: undefined,
      components: undefined,
      isOpen: false,
      width: undefined,
    })),
}));
