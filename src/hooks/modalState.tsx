import { type ReactNode } from "react";
import { create } from "zustand";

interface ModalStateType {
  isOpen: boolean;
  text: string;
  components?: ReactNode;
  onClick?: () => void;
  onClickName?: string;
  changeIsOpen: () => void;
  changeText: (newText: string) => void;
  changeOnClick: (newOnclick: () => void) => void;
  openModal: (prams: {
    newOnclick?: () => void;
    newText?: string;
    newComponents?: ReactNode;
  }) => void;
  closeModal: () => void;
}

export const useModalState = create<ModalStateType>((set) => ({
  isOpen: false,
  text: "",
  components: undefined,
  onClick: undefined,
  onClickName: "",
  changeIsOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  changeText: (newText) => set(() => ({ text: newText })),
  changeOnClick: (newOnclick) => set(() => ({ onClick: newOnclick })),
  openModal: ({ newOnclick, newText, newComponents }) =>
    set(() => ({
      text: newText,
      onClick: newOnclick,
      isOpen: true,
      components: newComponents,
    })),
  closeModal: () =>
    set(() => ({
      text: "",
      onClick: undefined,
      components: undefined,
      isOpen: false,
    })),
}));
