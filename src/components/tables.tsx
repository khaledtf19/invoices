import {
  type Invoice,
  type Customer,
  type InvoiceStatus,
  InvoiceStatusEnum,
} from "@prisma/client";
import { useRouter } from "next/router";
import {
  type PropsWithChildren,
  type FC,
  type ReactNode,
  useState,
} from "react";
import { DateFormat } from "../utils/utils";
import { LoadingAnimation, PrimaryButton } from "./utils";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnFiltersState,
  type Column,
  type Table,
} from "@tanstack/react-table";
import { InvoiceStatusArr } from "../types/utils.types";

export const THead: FC<PropsWithChildren> = ({ children }) => {
  return (
    <thead className="  bg-indigo-900 font-bold text-white">{children}</thead>
  );
};

export const TBody: FC<PropsWithChildren> = ({ children }) => {
  return <tbody className=" ">{children}</tbody>;
};

export const TR: FC<{ children: ReactNode; rowId?: string }> = ({
  children,
  rowId,
}) => {
  const router = useRouter();

  return (
    <tr
      className={` ${
        rowId ? "cursor-pointer" : ""
      }  hover:bg-indigo-900 hover:text-white`}
      onClick={() => {
        if (rowId) {
          router.push(`/invoice/${rowId}`);
        }
      }}
    >
      {children}
    </tr>
  );
};

export const TH: FC<PropsWithChildren & { size?: number }> = ({
  children,
  size,
}) => {
  console.log(size);
  return (
    <th
      className={` border border-black p-2 text-center ${
        size ? `w-[${size}px]` : ""
      }`}
    >
      {children}
    </th>
  );
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
    return <LoadingAnimation />;
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
            <TD>{String(customer.number)}</TD>
            <TD>{String(customer.idNumber)}</TD>
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
  const columnHelper = createColumnHelper<
    Invoice & {
      invoiceStatus: InvoiceStatus | null;
    }
  >();
  const [filter, setFilter] = useState<ColumnFiltersState>([]);

  const columns = [
    columnHelper.accessor("cost", {
      size: 200,
      cell: (info) => <span>{info.renderValue()}</span>,
      footer: (info) => info.column.id,
      header: () => "Cost",
    }),
    columnHelper.accessor("createdAt", {
      cell: (info) => DateFormat({ date: info.getValue() }),
      footer: (info) => info.column.id,
      header: () => "Created At",
    }),
    columnHelper.accessor("updatedAt", {
      cell: (info) => DateFormat({ date: info.getValue() }),
      footer: (info) => info.column.id,
      header: () => "Updated At",
    }),
    columnHelper.accessor("invoiceStatus.status", {
      cell: (info) => (
        <span
          className={
            info.getValue() === InvoiceStatusEnum.Rejected
              ? "text-red-700"
              : info.getValue() === InvoiceStatusEnum.Accepted
              ? "text-green-700"
              : "text-blue-700"
          }
        >
          {info.renderValue()}
        </span>
      ),
      footer: (info) => info.column.id,
      header: () => "Status",
    }),
  ];

  const table = useReactTable({
    data: invoices,
    columns,
    state: { columnFilters: filter },
    getCoreRowModel: getCoreRowModel(),
    enableColumnFilters: true,
    onColumnFiltersChange: setFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className=" flex w-full flex-col gap-4">
      <table className=" w-full min-w-max  border-collapse border border-violet-900">
        <THead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TR key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TH key={header.id} size={header.getSize()}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {header.column.getCanFilter() ? (
                    <div>
                      <Filter column={header.column} table={table} />
                    </div>
                  ) : null}
                </TH>
              ))}
            </TR>
          ))}
        </THead>
        <TBody>
          {table.getRowModel().rows.map((row) => (
            <TR key={row.id} rowId={invoices[row.index]?.id}>
              {row.getVisibleCells().map((cell) => (
                <TD key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TD>
              ))}
            </TR>
          ))}
        </TBody>
      </table>
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
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
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
    </div>
  );
};

function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  if (!InvoiceStatusEnum.valueOf().hasOwnProperty(String(firstValue))) {
    return <></>;
  }

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
