import { type FC, useState } from "react";
import { type CustomerDebt } from "@prisma/client";
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

const DebtTable: FC<{
  data: (CustomerDebt & {
    Customer: {
      number: string;
      name: string;
    } | null;
  })[];
}> = ({ data }) => {
  const columnHelper = createColumnHelper<
    CustomerDebt & {
      Customer: {
        number: string;
        name: string;
      } | null;
    }
  >();
  const [filter, setFilter] = useState<ColumnFiltersState>([]);

  const columns = [
    columnHelper.accessor("Customer.name", {
      size: 200,
      cell: (info) => <span>{info.renderValue()}</span>,
      footer: (info) => info.column.id,
      header: () => "Name",
    }),
    columnHelper.accessor("Customer.number", {
      size: 100,
      cell: (info) => <span>{info.renderValue()}</span>,
      footer: (info) => info.column.id,
      header: () => "Number",
    }),
    columnHelper.accessor("createdAt", {
      cell: (info) => DateFormat({ date: info.getValue() }),
      footer: (info) => info.column.id,
      header: () => "Created At",
    }),
    columnHelper.accessor("amount", {
      size: 50,
      cell: (info) => <span>{info.renderValue()}</span>,
      footer: (info) => info.column.id,
      header: () => "Amount",
    }),
  ];

  const table = useReactTable({
    data: data,
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
              rowId={data[row.index]?.customerId}
              route="customer"
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
export default DebtTable;
