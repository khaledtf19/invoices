import { type FC, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import {
  TBody,
  TD,
  TH,
  TR,
  THead,
  TableComponent,
  Filter,
  TablePag,
} from "./tables";
import { DateFormat } from "../../utils/utils";
import { type RouterOutputs } from "../../utils/trpc";

const ChangeBankTable: FC<{
  changeBank: RouterOutputs["user"]["getBankChange"];
}> = ({ changeBank }) => {
  const columnHelper =
    createColumnHelper<RouterOutputs["user"]["getBankChange"][number]>();
  const [filter, setFilter] = useState<ColumnFiltersState>([]);

  const columns = [
    columnHelper.accessor("user.email", {
      size: 200,
      cell: (info) => <span>{info.renderValue()}</span>,
      footer: (info) => info.column.id,
      header: () => "Admin",
    }),
    columnHelper.accessor("createdAt", {
      size: 200,
      cell: (info) => <span>{DateFormat({ date: info.getValue() })}</span>,
      header: () => "Created At",
      enableColumnFilter: false,
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
    columnHelper.accessor("bankName", {
      cell: (info) => <span>{info.renderValue()}</span>,
      header: () => "Created At",
    }),
  ];

  const table = useReactTable({
    data: changeBank,
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
            <TR
              key={row.id}
              route="invoice"
              rowId={changeBank[row.index]?.invoice?.id}
            >
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

export default ChangeBankTable;