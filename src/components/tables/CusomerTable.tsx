import { type FC } from "react";
import { TBody, TD, TH, TR, THead, TableComponent } from "./tables";
import LoadingTable from "./LoadingTable";

const CustomerTable: FC<{
  customers:
    | {
        number: string;
        id: string;
        name: string;
      }[]
    | undefined;
  isLoading: boolean;
}> = ({ customers, isLoading }) => {
  if (isLoading) {
    return <LoadingTable type="big" />;
  }

  if (!customers) {
    return <></>;
  }

  return (
    <TableComponent>
      <THead>
        <TR route="none">
          <TH size={200}>Name</TH>
          <TH size={150}>Number</TH>
        </TR>
      </THead>
      <TBody>
        {customers?.map((customer) => (
          <TR key={customer.id} route="customer" rowId={customer.id}>
            <TD>{customer.name}</TD>
            <TD>{String(customer.number)}</TD>
          </TR>
        ))}
      </TBody>
    </TableComponent>
  );
};

export default CustomerTable;
