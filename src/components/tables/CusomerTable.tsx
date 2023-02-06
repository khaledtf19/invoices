import { type FC } from "react";
import { TBody, TD, TH, TR, THead, TableComponent } from "./tables";
import { type Customer } from "@prisma/client";
import LoadingTable from "./LoadingTable";

const CustomerTable: FC<{
  customers: Customer[] | undefined;
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
          <TH size={150}>IDNumber</TH>
        </TR>
      </THead>
      <TBody>
        {customers?.map((customer) => (
          <TR key={customer.id} route="customer" rowId={customer.id}>
            <TD>{customer.name}</TD>
            <TD>{String(customer.number)}</TD>
            <TD>{String(customer.idNumber)}</TD>
          </TR>
        ))}
      </TBody>
    </TableComponent>
  );
};

export default CustomerTable;
