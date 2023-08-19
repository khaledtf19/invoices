import { type Customer, type CustomerNote, UserRole } from "@prisma/client";
import { type FC, useState } from "react";

import Container from "../../container/Container";
import { useUserState } from "../../hooks/userDataState";
import { Toggle } from "../utils";
import CustomerData from "./CustomerData";
import CustomerDebt from "./CustomerDebt";
import CustomerUpdateForm from "./CustomerUpdateForm";

const CustomerView: FC<{
  customerData: Customer & {
    customerDebt: CustomerDebt[];
  };
  refetch: () => void;
}> = ({ customerData, refetch }) => {
  const [toggle, setToggle] = useState(false);

  const { userData } = useUserState()((state) => ({ userData: state.user }));

  return (
    <Container
      size="max-w-md"
      rightComponent={
        <CustomerDebt
          debtData={customerData.customerDebt}
          customerId={customerData.id}
          refetch={refetch}
        />
      }
      openRight={customerData.customerDebt.length ? true : false}
    >
      {userData?.role === UserRole.Admin ? (
        <Toggle
          state={toggle}
          onChange={(e) => {
            setToggle(e.target.checked);
          }}
        />
      ) : (
        ""
      )}
      {toggle && userData?.role === UserRole.Admin ? (
        <CustomerUpdateForm customerData={customerData} refetch={refetch} />
      ) : (
        <CustomerData customerData={customerData} />
      )}
    </Container>
  );
};

export default CustomerView;
