import { CustomerDebt } from "@prisma/client";
import { DateFormat } from "../../utils/utils";
import { Input, PrimaryButton } from "../utils";
import { useModalState } from "../../hooks/modalState";
import { useState } from "react";

const CustomerDebt: React.FC<{
  debtData: CustomerDebt[];
  customerId: string;
}> = ({ debtData, customerId }) => {
  const { openModal } = useModalState((state) => ({
    openModal: state.openModal,
  }));
  return (
    <div className=" flex h-full w-full flex-col items-center p-2">
      <div className=" flex h-full flex-col items-center ">
        <div className="  flex items-center justify-center gap-10">
          <p>Amount</p>
          <p>Date</p>
        </div>
        {debtData.map((debt) => (
          <div
            key={debt.id}
            className=" flex items-center justify-center gap-10 text-red-600 "
          >
            <p>{debt.amount}</p>
            <p>{DateFormat({ date: debt.createdAt })}</p>
          </div>
        ))}
      </div>
      <div className=" w-2/4">
        <PrimaryButton
          label="ADD"
          onClick={() => {
            openModal({
              newComponents: <DebtModalComponent customerId={customerId} />,
            });
          }}
        />
      </div>
    </div>
  );
};

export default CustomerDebt;

const DebtModalComponent: React.FC<{ customerId: string }> = ({
  customerId,
}) => {
  const [amount, setAmount] = useState("");
  const addDebt = "";

  return (
    <div>
      <Input
        label="name"
        state={amount}
        onChange={() => {
          console.log();
        }}
        type="number"
      />
    </div>
  );
};
