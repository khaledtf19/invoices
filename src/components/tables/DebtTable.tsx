import {
  type ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { type FC, useMemo, useState } from "react";

import { TransactionsArr } from "../../types/utils.types";
import type { RouterOutputs } from "../../utils/trpc";
import { DateFormat } from "../../utils/utils";
import { CustomerDebtMessage } from "../customer/CustomerDebt";
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

const DebtTable: FC<{ data: RouterOutputs["customer"]["getAllDebt"] }> = ({
  data,
}) => {
  const columnHelper =
    createColumnHelper<RouterOutputs["customer"]["getAllDebt"][number]>();

  const dataM = useMemo(
    () =>
      data.map((item) => {
        if (!item.customer?.address && item.customer) {
          item.customer.address = "-";
        }
        return item;
      }),
    [data],
  );

  const [filter, setFilter] = useState<ColumnFiltersState>([]);
  const columns = [
    columnHelper.accessor("customer.name", {
      size: 200,
      cell: (info) => <span className="truncate w-40">{info.renderValue()}</span>,
      footer: (info) => info.column.id,
      header: () => "Name",
    }),
    columnHelper.accessor("customer.number", {
      cell: (info) => <span>{info.renderValue()}</span>,
      footer: (info) => info.column.id,
      header: () => "Number",
    }),
    columnHelper.accessor("customer.address", {
      size: 100,
      cell: (info) => <p className="truncate w-40">{info.renderValue()}</p>,
      footer: (info) => info.column.id,
      header: () => "Address",
    }),

    columnHelper.accessor("note", {
      size: 50,
      cell: (info) => (
        <CustomerDebtMessage noteText={info.renderValue() || ""} />
      ),
      footer: (info) => info.column.id,
      header: () => "Note",
      enableColumnFilter: false,
    }),
    columnHelper.accessor("createdAt", {
      size: 200,
      cell: (info) => <p className="text-sm">{DateFormat({ date: info.getValue() })}</p>,
      footer: (info) => info.column.id,
      header: () => "Created At",
      enableColumnFilter: false,
    }),
    columnHelper.accessor("updatedAt", {
      size: 150,
      cell: (info) =><p className="text-xs">{DateFormat({ date: info.getValue() })}</p>,
      footer: (info) => info.column.id,
      header: () => "updated At",
      enableColumnFilter: false,
    }),
    columnHelper.accessor("amount", {
      size: 50,
      cell: (info) => <span>{info.renderValue()?.toFixed(2)}</span>,
      footer: (info) => info.column.id,
      header: () => "Amount",
      enableColumnFilter: false
    }),
    columnHelper.accessor("isImportant",{
      size:50,
      cell: (info)=><div><input type="checkbox" checked={info.getValue()||false} /> </div>,
      header: ()=> "I"
    }),
    columnHelper.accessor("type", {
      size: 50,
      cell: (info) => (
        <span
          className={`${
            info.getValue() === TransactionsArr[0]
              ? "text-red-600"
              : "text-green-500"
          } `}
        >
          {info.renderValue()}
        </span>
      ),
      footer: (info) => info.column.id,
      header: () => "Type",
    }),
    columnHelper.accessor("deleted", {
      size: 50,
      cell: (info) => (
        <span
          className={`${info.getValue() ? "text-green-600" : "text-red-600"}`}
        >
          {info.getValue() === true ? "Deleted" : "Waiting"}{" "}
        </span>
      ),
      header: () => "Status",
    }),
  ];

  const table = useReactTable({
    data: dataM,
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
