import { type changeBalance } from "@prisma/client";
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

import { DateFormat } from "../../utils/utils";
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

const ChangeBalanceTable: FC<{
  changeBalance: (changeBalance & {
    admin: { name: string | null; email: string | null } | null;
    user: { name: string | null; email: string | null } | null;
  })[];
}> = ({ changeBalance }) => {
  const columnHelper = createColumnHelper<
    changeBalance & {
      admin: { name: string | null; email: string | null } | null;
      user: { name: string | null; email: string | null } | null;
    }
  >();
  const [filter, setFilter] = useState<ColumnFiltersState>([]);

  const columns = [
    columnHelper.accessor("admin.email", {
      size: 200,
      cell: (info) => <span>{info.renderValue()}</span>,
      footer: (info) => info.column.id,
      header: () => "From Admin",
    }),
    columnHelper.accessor("user.email", {
      size: 200,
      cell: (info) => <span>{info.renderValue()}</span>,
      header: () => "To User",
    }),
    columnHelper.accessor("amount", {
      size: 100,
      cell: (info) => <span>{info.renderValue()}</span>,
      header: () => "Amount",
    }),
    columnHelper.accessor("type", {
      size: 100,
      cell: (info) => <span>{info.renderValue()}</span>,
      header: () => "Type",
    }),
    columnHelper.accessor("createdAt", {
      cell: (info) => <span>{DateFormat({ date: info.getValue() })}</span>,
      header: () => "Created At",
      enableColumnFilter: false,
    }),
  ];

  const table = useReactTable({
    data: changeBalance,
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
            <TR key={row.id} route="none" rowId="none">
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

export default ChangeBalanceTable;
