import { InvoiceStatusEnum, UserRole } from "@prisma/client";
import { useRouter } from "next/router";
import { type PropsWithChildren, type FC, type ReactNode, useEffect } from "react";
import { PrimaryButton } from "../utils";
import { type Column, type Table } from "@tanstack/react-table";
import { InvoiceStatusArr, TransactionsArr, UserRoleArr } from "../../types/utils.types";

export const TableComponent: FC<PropsWithChildren & { moreClass?: string }> = ({
  children,
  moreClass,
}) => {
  return (
    <table
      className={` w-full p-2 shadow-2xl ${moreClass} min-h-0  animate-opacityAnimation`}
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
        className=" px-2 text-sm font-normal text-black"
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


  if (typeof firstValue === "number" || typeof firstValue === "object") {
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
        className="font-normal text-black text-center"
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
    return <select
      className="font-normal text-black text-center"
      onChange={(e) => {
        column.setFilterValue(e.target.value === "all" ? undefined : e.target.value)
      }}>
      <option value={"all"}>All</option>
      {TransactionsArr.map((transaction) => (
        <option key={transaction} value={transaction}>{transaction}</option>
      ))}
    </select>;
  }

  if (firstValue === true || firstValue === false) {
    // column.setFilterValue(false)
    useEffect(() => {
      column.setFilterValue(false)
    }, [])
    return <select
      defaultValue={"false"}
      className="font-normal text-black text-center px-1"
      onChange={(e) => {
        column.setFilterValue(e.target.value === "all" ? undefined : e.target.value === "true" ? true : false)
      }}>
      <option value={"false"} >Waiting</option>
      <option value={"true"}>Deleted</option>
      <option value={"all"}>All</option>
    </select>

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
