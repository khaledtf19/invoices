import {
  type ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { type FC, useEffect, useState } from "react";

import { useModalState } from "../../hooks/modalState";
import { TransactionsArr } from "../../types/utils.types";
import { type RouterOutputs } from "../../utils/trpc";
import { DateFormat } from "../../utils/utils";
import { ModalUndoBankChange } from "../InvoiceView";
import {
  Filter,
  TBody,
  TD,
  TH,
  THead,
  TR,
  TableComponent,
  TablePag,
  isWithinRange,
} from "./tables";

const ChangeBankTable: FC<{
  changeBank: RouterOutputs["bank"]["getBankChange"];
}> = ({ changeBank }) => {
  const columnHelper =
    createColumnHelper<RouterOutputs["bank"]["getBankChange"][number]>();
  const [filter, setFilter] = useState<ColumnFiltersState>([]);

  const { closeModal, openModal } = useModalState((state) => ({
    openModal: state.openModal,
    closeModal: state.closeModal,
  }));

  const columns = [
    columnHelper.accessor("user.email", {
      size: 200,
      cell: (info) => <span>{info.renderValue()}</span>,
      header: () => "Admin",
    }),
    columnHelper.accessor("invoice.customer.name", {
      size: 200,
      cell: (info) => <span>{info.renderValue()}</span>,
      header: () => "invoice",
    }),
    columnHelper.accessor("createdAt", {
      size: 200,
      cell: (info) => <span>{DateFormat({ date: info.getValue() })}</span>,
      header: () => "Created At",
      filterFn: isWithinRange,
    }),
    columnHelper.accessor("amount", {
      size: 100,
      cell: (info) => <span>{info.renderValue()}</span>,
      header: () => "Amount",
    }),
    columnHelper.accessor("type", {
      size: 100,
      cell: (info) => (
        <span
          className={`${
            info.getValue() === TransactionsArr[0]
              ? "text-green-600"
              : "text-red-500"
          } `}
        >
          {info.renderValue()}
        </span>
      ),
      header: () => "Type",
    }),
    columnHelper.accessor("bankName", {
      size: 100,
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

  useEffect(() => {
    return closeModal();
  }, []);

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
              route={changeBank[row.index]?.invoice?.id ? "invoice" : "none"}
              rowId={changeBank[row.index]?.invoice?.id}
              onClick={() => {
                if (!changeBank[row.index]?.invoice?.id) {
                  openModal({
                    newComponents: (
                      <ModalUndoBankChange
                        bankChangeId={changeBank[row.index]?.id || "id"}
                      />
                    ),
                  });
                }
              }}
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
