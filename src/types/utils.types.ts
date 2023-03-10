import { z } from "zod";

export interface CustomerInterface {
  name: string;
  number: bigint | null;
  idNumber?: bigint | null;
  mobile: bigint[] | [];
}

export const UserRoleArr = ["User", "Admin"] as const;

export const InvoiceStatusArr = ["Waiting", "Rejected", "Accepted"] as const;

export type UserRoleType = (typeof UserRoleArr)[number];
export type InvoiceStatusType = (typeof InvoiceStatusArr)[number];

export const BalanceArr = ["Add", "Take"] as const;
export type ChangeBalanceType = (typeof BalanceArr)[number];
export const ZBalance = z.enum(BalanceArr);
