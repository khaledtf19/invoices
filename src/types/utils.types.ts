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

export const TransactionsArr = ["Add", "Take"] as const;
export type TransactionsType = (typeof TransactionsArr)[number];
export const Ztransactions = z.enum(TransactionsArr);
