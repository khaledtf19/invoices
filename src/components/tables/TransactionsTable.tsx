import { type FC, useState } from "react";
import { type Transaction } from "@prisma/client";
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

const TransactionsTable: FC<{
  transactions: (Transaction & {
    invoice: {
      id: string;
      createdAt: Date;
      cost: number;
    };
    user: {
      name: string | null;
      email: string | null;
    };
  })[];
}> = ({ transactions }) => {
  const columnHelper = createColumnHelper<
    Transaction & {
      invoice: {
        id: string;
        createdAt: Date;
        cost: number;
      };
      user: {
        name: string | null;
        email: string | null;
      };
    }
  >();
  const [filter, setFilter] = useState<ColumnFiltersState>([]);

  const columns = [
    columnHelper.accessor("invoice.cost", {
      size: 100,
      cell: (info) => <span>{info.renderValue()}</span>,
      footer: (info) => info.column.id,
      header: () => "Cost",
    }),
    columnHelper.accessor("user.name", {
      size: 200,
      cell: (info) => <span>{info.renderValue()}</span>,
      header: () => "Name",
    }),
    columnHelper.accessor("user.email", {
      size: 200,
      cell: (info) => <span>{info.renderValue()}</span>,
      header: () => "Email",
    }),
    columnHelper.accessor("invoice.createdAt", {
      cell: (info) => <span>{DateFormat({ date: info.getValue() })}</span>,
      header: () => "Created At",
      enableColumnFilter: false,
    }),
  ];

  const table = useReactTable({
    data: transactions,
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
              rowId={transactions[row.index]?.invoiceId}
              route="invoice"
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

export default TransactionsTable;
