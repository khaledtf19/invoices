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

import type { RouterOutputs } from "../../utils/trpc";
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
import { useModalState } from "../../hooks/modalState";
import { AddOrUpdateCardsModal } from "../cards";

const CardsTable: FC<{
  cards: RouterOutputs["invoice"]["getAllCalc"];
}> = ({ cards }) => {
  const columnHelper =
    createColumnHelper<RouterOutputs["invoice"]["getAllCalc"][number]>();
  const [filter, setFilter] = useState<ColumnFiltersState>([]);

  const columns = [
    columnHelper.accessor("cost", {
      size: 100,
      cell: (info) => <span>{info.renderValue()}</span>,
      footer: (info) => info.column.id,
      header: () => "Cost",
    }),
    columnHelper.accessor("values", {
      size: 200,
      cell: (info) => {
        const nums = info.getValue() as number[]
       return ( <div className="flex gap-1">
          {nums.map((v, i) => (
            <span>
              {i == 0 ? "" : " + "} {v}
            </span>
          ))}
        </div>)
      },
      footer: (info) => info.column.id,
      header: () => "Cards",
      enableColumnFilter: false
    }),
  ];

  const table = useReactTable({
    data: cards,
    columns,
    state: { columnFilters: filter },
    getCoreRowModel: getCoreRowModel(),
    enableColumnFilters: true,
    onColumnFiltersChange: setFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const { openModal, closeModal } = useModalState((state) => ({
    openModal: state.openModal,
    closeModal: state.closeModal,
  }));

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
            <tr key={row.id} onClick={()=>{
              openModal({newComponents:<AddOrUpdateCardsModal id={cards[row.index]?.id} />})
            }}>
              {row.getVisibleCells().map((cell) => (
                <TD key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TD>
              ))}
            </tr>
          ))}
        </TBody>
      </TableComponent>
      <TablePag table={table} />
    </div>
  );
};
export default CardsTable;
