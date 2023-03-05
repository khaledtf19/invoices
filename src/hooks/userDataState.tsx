import { type UserRole } from "@prisma/client";
import { create } from "zustand";
import { trpc } from "../utils/trpc";
import { useEffect } from "react";

interface userStateType {
  refetchUserData: () => void;
  updateUser: () => void;
  user:
    | ({
        id: string;
        role: UserRole;
        userBalance: number;
      } & {
        name?: string | null | undefined;
        email?: string | null | undefined;
        image?: string | null | undefined;
      })
    | undefined;
}

export const useUserState = () => {
  const { data: userData, refetch } = trpc.auth.getSession.useQuery();
  const state = create<userStateType>((set) => ({
    user: userData,
    refetchUserData: () => {
      refetch();
    },
    updateUser: () => {
      set({ user: userData });
    },
  }));

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  return state;
};
