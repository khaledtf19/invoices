import {
  type Invoice,
  type Customer,
  type InvoiceStatus,
  type User,
  InvoiceStatusEnum,
  UserRole,
} from "@prisma/client";
import { useRouter } from "next/router";
import {
  type PropsWithChildren,
  type FC,
  type ReactNode,
  useState,
} from "react";
import { DateFormat, randomTableData } from "../utils/utils";
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
import { InvoiceStatusArr, UserRoleArr } from "../types/utils.types";

const TableComponent: FC<PropsWithChildren & { moreClass?: string }> = ({
  children,
  moreClass,
}) => {
  return (
    <table className={` w-full p-2 shadow-2xl ${moreClass} `}>{children}</table>
  );
};

export const THead: FC<PropsWithChildren> = ({ children }) => {
  return (
    <thead className="  bg-gray-800 font-bold text-white">{children}</thead>
  );
};

export const TBody: FC<PropsWithChildren> = ({ children }) => {
  return <tbody className=" ">{children}</tbody>;
};

export const TR: FC<{
  children: ReactNode;
  rowId?: string;
  route: "none" | "customer" | "invoice" | "user";
}> = ({ children, rowId, route }) => {
  const router = useRouter();

  return (
    <tr
      className={` ${
        rowId ? "cursor-pointer hover:bg-gray-600" : ""
      }   hover:text-white`}
      onClick={() => {
        if (rowId) {
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
  console.log(size);
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

export const LoadingTable: FC<{ type: "small" | "big" }> = ({ type }) => {
  return (
    <TableComponent moreClass="blur-sm">
      <THead>
        <TR route="none">
          <TH size={200}>Name</TH>
          <TH size={150}>Number</TH>
          <TH size={150}>IDNumber</TH>
        </TR>
      </THead>
      <TBody>
        {randomTableData.slice(0, type === "big" ? 10 : 5).map((data) => (
          <TR key={data.id} route="none">
            <TD>{data.name}</TD>
            <TD>{String(data.number)}</TD>
            <TD>{String(data.idNumber)}</TD>
          </TR>
        ))}
      </TBody>
    </TableComponent>
  );
};

export const CustomerTable: FC<{
  customers: Customer[] | undefined;
  isLoading: boolean;
}> = ({ customers, isLoading }) => {
  if (isLoading) {
    return <LoadingTable type="big" />;
  }

  if (!customers) {
    return <></>;
  }

  return (
    <TableComponent>
      <THead>
        <TR route="none">
          <TH size={200}>Name</TH>
          <TH size={150}>Number</TH>
          <TH size={150}>IDNumber</TH>
        </TR>
      </THead>
      <TBody>
        {customers?.map((customer) => (
          <TR key={customer.id} route="customer" rowId={customer.id}>
            <TD>{customer.name}</TD>
            <TD>{String(customer.number)}</TD>
            <TD>{String(customer.idNumber)}</TD>
          </TR>
        ))}
      </TBody>
    </TableComponent>
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
      size: 100,
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
      <TableComponent>
        <THead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TR key={headerGroup.id} route="none">
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
            <TR key={row.id} rowId={invoices[row.index]?.id} route="invoice">
              {row.getVisibleCells().map((cell) => (
                <TD key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TD>
              ))}
            </TR>
          ))}
        </TBody>
      </TableComponent>
      <TablePag table={table} />
    </div>
  );
};

export const UsersTable: FC<{ users: User[] }> = ({ users }) => {
  const columnHelper = createColumnHelper<User>();
  const [filter, setFilter] = useState<ColumnFiltersState>([]);

  const columns = [
    columnHelper.accessor("name", {
      size: 200,
      cell: (info) => <span>{info.renderValue()}</span>,
      footer: (info) => info.column.id,
      header: () => "Name",
    }),
    columnHelper.accessor("email", {
      size: 200,
      cell: (info) => <span>{info.renderValue()}</span>,
      header: () => "Email",
    }),
    columnHelper.accessor("userBalance", {
      cell: (info) => <span>{info.renderValue()}</span>,
      header: () => "Balance",
    }),
    columnHelper.accessor("role", {
      cell: (info) => <span>{info.renderValue()}</span>,
      header: () => "Role",
    }),
  ];

  const table = useReactTable({
    data: users,
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
      <TableComponent>
        <THead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TR key={headerGroup.id} route="none">
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
            <TR key={row.id} rowId={users[row.index]?.id} route="user">
              {row.getVisibleCells().map((cell) => (
                <TD key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TD>
              ))}
            </TR>
          ))}
        </TBody>
      </TableComponent>
      <TablePag table={table} />
    </div>
  );
};

const TablePag: FC<{ table: Table<any> }> = ({ table }) => {
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

const Filter: FC<{
  column: Column<any, any>;
  table: Table<any>;
}> = ({ column, table }) => {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  // console.log(column.getFilterValue(), typeof firstValue);

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
        className="font-normal text-black"
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
