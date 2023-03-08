import { CustomerDebt } from "@prisma/client";
import { DateFormat } from "../../utils/utils";
import { Input, LoadingAnimation, PrimaryButton, RedButton } from "../utils";
import { useModalState } from "../../hooks/modalState";
import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";

const CustomerDebt: React.FC<{
  debtData: CustomerDebt[];
  customerId: string;
  refetch: () => void;
}> = ({ debtData, customerId, refetch }) => {
  const { openModal, closeModal } = useModalState((state) => ({
    openModal: state.openModal,
    closeModal: state.closeModal,
  }));

  useEffect(() => {
    return closeModal();
  }, [closeModal]);

  return (
    <div className=" flex h-full w-full flex-col items-center p-2 text-sm">
      <div className=" flex h-full w-full flex-col items-center ">
        <table className=" w-full">
          <thead className=" w-full">
            <tr className="  flex w-full items-center justify-evenly gap-5 text-center ">
              <th className=" w-full">
                <p>Amount</p>
              </th>
              <th className=" w-full">Created At</th>
            </tr>
          </thead>
          <tbody className="flex flex-col gap-2">
            {debtData.map((debt) => (
              <th
                key={debt.id}
                className="  flex w-full items-center justify-evenly gap-1 text-center text-red-600 "
              >
                <td className=" w-full border-r border-red-600 ">
                  {debt.amount}
                </td>
                <td className=" w-10">
                  <RedButton
                    label="X"
                    onClick={() => {
                      openModal({
                        newComponents: (
                          <DeleteDebtModal refetch={refetch} debtId={debt.id} />
                        ),
                      });
                    }}
                  />
                </td>
                <td className=" w-full border-l border-red-600">
                  {DateFormat({ date: debt.createdAt })}
                </td>
              </th>
            ))}
          </tbody>
        </table>
      </div>
      <div className=" w-2/4">
        <PrimaryButton
          label="ADD"
          onClick={() => {
            openModal({
              newComponents: (
                <CreateDebtModal customerId={customerId} refetch={refetch} />
              ),
            });
          }}
        />
      </div>
    </div>
  );
};

export default CustomerDebt;

const CreateDebtModal: React.FC<{
  customerId: string;
  refetch: () => void;
}> = ({ customerId, refetch }) => {
  const [amount, setAmount] = useState("");
  const addDebt = trpc.customer.createDebt.useMutation();

  useEffect(() => {
    if (addDebt.isSuccess) {
      refetch();
    }
  }, [addDebt.isSuccess, refetch]);

  return (
    <div className="flex flex-col items-center justify-center">
      {addDebt.isLoading ? (
        <div className="py-10 px-16">
          <LoadingAnimation />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-8">
          <div>
            <Input
              label="name"
              state={amount}
              onChange={(e) => {
                const result = e.target.value.replace(/\D/g, "");
                setAmount(result);
              }}
              type="number"
            />
            <p className=" text-red-600">
              {Number(amount) ? "" : "Must Be A Number"}
            </p>
          </div>
          <div>
            <PrimaryButton
              label="Create debt"
              onClick={async () => {
                if (Number(amount)) {
                  addDebt.mutateAsync({
                    amount: Number(amount),
                    customerId: customerId,
                  });
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const DeleteDebtModal: React.FC<{
  refetch: () => void;
  debtId: string;
}> = ({ debtId, refetch }) => {
  const deleteDebt = trpc.customer.deleteDebt.useMutation();

  useEffect(() => {
    if (deleteDebt.isSuccess) {
      refetch();
    }
  }, [deleteDebt.isSuccess, refetch]);

  return (
    <div className=" flex items-center">
      {deleteDebt.isLoading ? (
        <LoadingAnimation />
      ) : (
        <div className=" flex flex-col gap-10">
          <p>Do you want to to delete this debt</p>
          <RedButton
            label="Delete"
            onClick={async () => {
              deleteDebt.mutateAsync({ debtId: debtId });
            }}
          />
        </div>
      )}
    </div>
  );
};
