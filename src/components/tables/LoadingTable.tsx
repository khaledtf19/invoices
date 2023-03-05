import { type FC } from "react";
import { TBody, TD, TH, TR, THead, TableComponent } from "./tables";
import { randomTableData } from "../../utils/utils";

const LoadingTable: FC<{ type: "small" | "big" }> = ({ type }) => {
  return (
    <TableComponent moreClass="blur-sm  animate-pulse">
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

export default LoadingTable;
