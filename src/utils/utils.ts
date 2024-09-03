import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const BigNumberLength = 999_999_999_999_999;
export const MinNumberLength = 9999;

export const DateFormat: (data: { date: Date }) => string = ({ date }) => {
  return date.toLocaleString("en-GB", {
    timeStyle: "short",
    dateStyle: "short",
  });
};

export const TrpcErrorMessage = (data: string) => {
  return JSON.parse(data)[0]["message"] as string;
};

export const randomTableData = [
  {
    id: "0",
    name: "Name Name Name",
    number: "123456789",
    idNumber: "123456789",
  },
  {
    id: "1",
    name: "Name Name Name",
    number: "123456789",
    idNumber: "123456789",
  },
  {
    id: "2",
    name: "Name Name Name",
    number: "123456789",
    idNumber: "123456789",
  },
  {
    id: "3",
    name: "Name Name Name",
    number: "123456789",
    idNumber: "123456789",
  },
  {
    id: "4",
    name: "Name Name Name",
    number: "123456789",
    idNumber: "123456789",
  },
  {
    id: "5",
    name: "Name Name Name",
    number: "123456789",
    idNumber: "123456789",
  },
  {
    id: "6",
    name: "Name Name Name",
    number: "123456789",
    idNumber: "123456789",
  },
  {
    id: "7",
    name: "Name Name Name",
    number: "123456789",
    idNumber: "123456789",
  },
  {
    id: "8",
    name: "Name Name Name",
    number: "123456789",
    idNumber: "123456789",
  },
  {
    id: "9",
    name: "Name Name Name",
    number: "123456789",
    idNumber: "123456789",
  },
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CardsArr = [
  150.0, 100.0, 75.0, 60.0, 50.0, 40.0, 30.0, 29.0, 17.5, 11.5, 10.5, 8.0, 6.0, 20.0, 10.0, 12.5, 15.0
] as const;
