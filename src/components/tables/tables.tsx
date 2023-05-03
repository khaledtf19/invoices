import { InvoiceStatusEnum, UserRole } from "@prisma/client";
import { useRouter } from "next/router";
import {
  type PropsWithChildren,
  type FC,
  type ReactNode,
  useEffect,
} from "react";
import { PrimaryButton } from "../utils";
import { type Column, type Table } from "@tanstack/react-table";
import {
  BankNameArr,
  InvoiceStatusArr,
  TransactionsArr,
  UserRoleArr,
} from "../../types/utils.types";


export const TableComponent: FC<PropsWithChildren & { moreClass?: string }> = ({
  children,
  moreClass,
}) => {
  return (
    <table
      className={` w-full p-2 shadow-2xl ${moreClass} min-h-0 animate-opacityAnimation text-sm`}
    >
      {children}
    </table>
  );
};

export const THead: FC<PropsWithChildren> = ({ children }) => {
  return (
    <thead className="  bg-blue-800 font-bold text-white">{children}</thead>
  );
};

export const TBody: FC<PropsWithChildren> = ({ children }) => {
  return <tbody className=" ">{children}</tbody>;
};

export const TR: FC<{
  children: ReactNode;
  rowId?: string | null;
  route: "none" | "customer" | "invoice" | "user";
}> = ({ children, rowId, route }) => {
  const router = useRouter();

  return (
    <tr
      className={` ${rowId
        ? "cursor-pointer transition-colors duration-500 hover:bg-blue-600 hover:text-white"
        : ""
        }   `}
      onClick={() => {
        if (route !== "none") {
          router.push(`/${route}/${rowId}`);
        }
      }}
    >
      {children}
    </tr>
  );
};

export const TH: FC<PropsWithChildren & { size: number }> = ({
  children,
  size,
}) => {
  return (
    <th
      className={` border p-2 text-center shadow-sm `}
      style={{ width: size }}
    >
      {children}
    </th>
  );
};

export const TD: FC<PropsWithChildren> = ({ children }) => {
  return <td className=" border p-2 text-center shadow-sm ">{children}</td>;
};

export const TablePag: FC<{ table: Table<any> }> = ({ table }) => {
  return (
    <div className=" flex w-full justify-end gap-6">
      <select
        className=" px-2 text-sm font-normal border rounded-md border-gray-600 text-black"
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
      >
        {[5, 10, 20, 50].map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      <span className="flex items-center gap-1">
        <div>Page</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </strong>
      </span>
      <div className=" w-24">
        <PrimaryButton
          label="Next"
          onClick={() => {
            const currPageIndex = table.getState().pagination.pageIndex;
            if (currPageIndex + 1 !== table.getPageCount()) {
              table.setPageIndex(currPageIndex + 1);
            }
          }}
        />
      </div>
      <div className=" w-24">
        <PrimaryButton
          label="Prev"
          onClick={() => {
            const currPageIndex = table.getState().pagination.pageIndex;
            if (currPageIndex !== 0) {
              table.setPageIndex(currPageIndex - 1);
            }
          }}
        />
      </div>
    </div>
  );
};

export const Filter: FC<{
  column: Column<any, any>;
  table: Table<any>;
}> = ({ column, table }) => {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  useEffect(() => {
    if (typeof firstValue === "boolean") {
      column.setFilterValue(false);
    }
  }, []);

  if (typeof firstValue === "number") {
    return <></>;
  }

  if (InvoiceStatusEnum.valueOf().hasOwnProperty(String(firstValue))) {
    return (
      <select
        className=" px-2 text-sm font-normal text-black"
        onChange={(e) => {
          column.setFilterValue(
            e.target.value === "all" ? undefined : e.target.value
          );
        }}
      >
        <option value="all">All</option>
        {InvoiceStatusArr.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    );
  }

  if (UserRole.valueOf().hasOwnProperty(String(firstValue))) {
    return (
      <select
        className="text-center font-normal text-black"
        onChange={(e) => {
          column.setFilterValue(
            e.target.value === "all" ? undefined : e.target.value
          );
        }}
      >
        <option value="all">All</option>
        {UserRoleArr.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
    );
  }

  if (firstValue === "Add" || firstValue === "Take") {
    return (
      <select
        className="text-center font-normal text-black"
        onChange={(e) => {
          column.setFilterValue(
            e.target.value === "all" ? undefined : e.target.value
          );
        }}
      >
        <option value={"all"}>All</option>
        {TransactionsArr.map((transaction) => (
          <option key={transaction} value={transaction}>
            {transaction}
          </option>
        ))}
      </select>
    );
  }

  if (firstValue === true || firstValue === false) {
    return (
      <select
        defaultValue={"false"}
        className="px-1 text-center font-normal text-black"
        onChange={(e) => {
          column.setFilterValue(
            e.target.value === "all"
              ? undefined
              : e.target.value === "true"
                ? true
                : false
          );
        }}
      >
        <option value={"false"}>Waiting</option>
        <option value={"true"}>Deleted</option>
        <option value={"all"}>All</option>
      </select>
    );
  }

  if (firstValue === BankNameArr[0] || firstValue === BankNameArr[1]) {
    return <select
      className="px-1 text-center font-normal text-black"
      onChange={(e) => {

        column.setFilterValue(
          e.target.value === "all" ? undefined : e.target.value
        );
      }} >
      <option value={"all"}>All</option>
      {BankNameArr.map((bank) => (
        <option key={bank} value={bank}>{bank}</option>
      ))}
    </select>;
  }

  if (firstValue instanceof Date) {
    return <div className=" flex items-center justify-center w-full">
      <div className="relative max-w-sm flex gap-1 ">
        <input type="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-3 p-1  " placeholder="Select date" onChange={(e) => { column.setFilterValue((old: [Date, Date]) => [new Date(e.target.value), old?.[1]]) }} />
        <input type="date" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  pl-3 p-1  " placeholder="Select date" onChange={(e) => { column.setFilterValue((old: [Date, Date]) => [old?.[0], new Date(e.target.value)]) }} />

      </div>
    </div>
  }

  return (
    <div>
      <input
        className="p-1 font-normal text-black"
        value={column.getFilterValue() ? String(column.getFilterValue()) : ""}
        onChange={(e) => {
          column.setFilterValue(e.target.value);
        }}
      />
    </div>
  );
};

export const isWithinRange = (row: any, columnId: string, value: [Date, Date]) => {
  const date = row.getValue(columnId) as Date;
  const [start, end] = value;
  //If one filter defined and date is null filter it
  if ((start || end) && !date) return false;
  if (start && !end) {
    return date.getTime() >= start.getTime()
  } else if (!start && end) {
    return date.getTime() <= end.getTime()
  } else if (start && end) {
    return date.getTime() >= start.getTime() && date.getTime() <= end.getTime()
  } else return true;
};
