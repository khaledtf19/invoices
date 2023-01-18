export interface CustomerInterface {
  name: string;
  number: number;
  idNumber?: number;
  mobile: number[] | [];
}

export const UserRoleArr = ["User", "Admin"] as const;

export const InvoiceStatusArr = ["Waiting", "Rejected", "Accepted"] as const;

export type UserRoleType = typeof UserRoleArr[number];
export type InvoiceStatusType = typeof InvoiceStatusArr[number];
