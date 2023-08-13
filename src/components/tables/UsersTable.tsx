import { type User } from "@prisma/client";
import {
  type ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { type FC, useState } from "react";

import {
  Filter,
  TBody,
  TD,
  TH,
  THead,
  TR,
  TableComponent,
  TablePag,
} from "./tables";

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
                        header.getContext(),
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
