import type {
  Invoice,
  Customer,
  InvoiceStatus,
  InvoiceNote,
} from "@prisma/client";
import { useRouter } from "next/router";
import type { PropsWithChildren, FC, ReactNode } from "react";
import { DateFormat } from "../utils/utils";

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
        <TR>
          <th className=" border border-black p-2 text-center">Name</th>
          <TH>Number</TH>
          <TH>IDNumber</TH>
        </TR>
      </THead>
      <TBody>
        {customers?.map((customer) => (
          <TR key={customer.id}>
            <td
              className="  min-w-[150px] max-w-[200px] cursor-pointer border border-black p-2 text-center"
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

export const InvoicesTable: FC<{
  invoices: (Invoice & {
    invoiceStatus: InvoiceStatus | null;
  })[];
}> = ({ invoices }) => {
  const router = useRouter();
  return (
    <table className=" w-full min-w-max  border-collapse border border-violet-900">
      <THead>
        <TR>
          <TH>Cost</TH>
          <TH>Created At</TH>
          <TH>Updated At</TH>
          <TH>Status</TH>
        </TR>
      </THead>
      <TBody>
        {invoices.map((invoice) => (
          <TR key={invoice.id}>
            <td
              onClick={() => {
                router.push(`/invoice/${invoice.id}`);
              }}
              className=" cursor-pointer border border-black p-2 text-center"
            >
              {invoice.cost}
            </td>
            <TD>{DateFormat({ date: invoice.createdAt })}</TD>
            <TD>{DateFormat({ date: invoice.updatedAt })}</TD>
            <TD>{invoice.invoiceStatus?.status}</TD>
          </TR>
        ))}
      </TBody>
    </table>
  );
};
