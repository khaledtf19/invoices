import { type Customer } from "@prisma/client";
import { useRouter } from "next/router";
import type { PropsWithChildren, FC, ReactNode } from "react";

export const CustomerTable: FC<{
  customers: Customer[] | undefined;
  isLoading: boolean;
}> = ({ customers, isLoading }) => {
  const router = useRouter();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!customers) {
    return <></>;
  }

  return (
    <table className=" w-full min-w-max  border-collapse border border-violet-900">
      <THead>
        <tr>
          <th className=" border border-black p-2 text-center">Name</th>
          <TH>Number</TH>
          <TH>IDNumber</TH>
        </tr>
      </THead>
      <TBody>
        {customers?.map((customer) => (
          <TR key={customer.id}>
            <td
              className=" hover: min-w-[150px] max-w-[200px] cursor-pointer border border-black p-2 text-center"
              onClick={() => {
                router.push(`customer/${customer.id}`);
              }}
            >
              {customer.name}
            </td>
            <TD>{customer.number}</TD>
            <TD>{customer.idNumber}</TD>
          </TR>
        ))}
      </TBody>
    </table>
  );
};

export const THead: FC<PropsWithChildren> = ({ children }) => {
  return (
    <thead className="  bg-indigo-900 font-bold text-white">{children}</thead>
  );
};

export const TBody: FC<PropsWithChildren> = ({ children }) => {
  return <tbody className=" ">{children}</tbody>;
};

export const TR: FC<{ children: ReactNode }> = ({ children }) => {
  return <tr className=" hover:bg-indigo-900  hover:text-white">{children}</tr>;
};

export const TH: FC<PropsWithChildren> = ({ children }) => {
  return <th className=" border border-black p-2 text-center">{children}</th>;
};

export const TD: FC<PropsWithChildren> = ({ children }) => {
  return <td className=" border border-black p-2 text-center">{children}</td>;
};
