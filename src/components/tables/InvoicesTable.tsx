import { type FC, useState } from "react";
import {
  InvoiceStatusEnum,
  type Invoice,
  type InvoiceStatus,
} from "@prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { DateFormat } from "../../utils/utils";
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

const InvoicesTable: FC<{
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
export default InvoicesTable;
