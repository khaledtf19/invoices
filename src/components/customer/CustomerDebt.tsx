import { CustomerDebt } from "@prisma/client";
import { BsFillChatSquareTextFill } from "react-icons/bs";
import { DateFormat } from "../../utils/utils";
import {
  Input,
  LoadingAnimation,
  PrimaryButton,
  RedButton,
  SecondaryButton,
} from "../utils";
import { useModalState } from "../../hooks/modalState";
import { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import {
  TransactionsArr,
  type TransactionsType,
} from "../../types/utils.types";
import CustomerDebtModal from "./CustomerDebtModal";

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
            <tr className="  flex w-full content-center items-center justify-evenly gap-5 text-center ">
              <th className=" flex w-2/5  justify-center">
                <BsFillChatSquareTextFill size={20} />
              </th>
              <th className=" w-full">
                <p>Amount</p>
              </th>
              <th className=" w-15">
                <p>Delete</p>
              </th>
              <th className="w-full ">Created At</th>
            </tr>
          </thead>
          <tbody className="flex flex-col gap-2">
            {debtData.map((debt) => (
              <tr
                key={debt.id}
                className={` flex w-full items-center justify-evenly gap-1 text-center ${
                  debt.type === TransactionsArr[0]
                    ? "text-red-600"
                    : "text-green-500"
                } `}
              >
                <td
                  className=" flex w-2/5  cursor-pointer  justify-center  border-r border-red-600"
                  onClick={() => {
                    openModal({
                      newComponents: (
                        <DebtNoteModal
                          debtId={debt.id}
                          refetch={refetch}
                          note={debt.note || ""}
                        />
                      ),
                    });
                  }}
                >
                  <BsFillChatSquareTextFill size={20} />
                </td>
                <td className=" w-full  border-r border-red-600 ">
                  {debt.amount}
                </td>
                <td className=" w-15">
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
                <td className="w-full  border-l border-red-600 ">
                  {DateFormat({ date: debt.createdAt })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex w-2/4 gap-3">
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
        <SecondaryButton
          label="Show All"
          onClick={() => {
            openModal({
              newWidth: "big",
              newComponents: <CustomerDebtModal customerId={customerId} />,
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
  const [tType, setTtype] = useState<TransactionsType>("Add");
  const addDebt = trpc.customer.createDebt.useMutation();

  useEffect(() => {
    if (addDebt.isSuccess) {
      refetch();
    }
  }, [addDebt.isSuccess, refetch]);

  return (
    <div className="flex flex-col items-center justify-center">
      {addDebt.isLoading ? (
        <div className="px-16 py-10">
          <LoadingAnimation />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="flex flex-col gap-3">
            <Input
              label="Amount"
              state={amount}
              onChange={(e) => {
                const result = e.target.value.replace(/\D/g, "");
                setAmount(result);
              }}
              type="number"
            />
            <select
              className={` bg-blue-900 text-center text-xl font-bold shadow-lg  ${
                tType === TransactionsArr[0] ? "text-red-600" : "text-green-600"
              }`}
              onChange={(e) => {
                setTtype(e.currentTarget.value as TransactionsType);
              }}
            >
              {TransactionsArr.map((transaction) => (
                <option key={transaction} value={transaction}>
                  {transaction}
                </option>
              ))}
            </select>

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
                    type: tType,
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

const DebtNoteModal: React.FC<{
  debtId: string;
  note: string;
  refetch: () => void;
}> = ({ debtId, note, refetch }) => {
  const [noteState, setNoteState] = useState(note);
  const updateDebtNote = trpc.customer.updateDebtNote.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <div className=" flex w-full items-center justify-center py-3">
      {updateDebtNote.isLoading ? (
        <LoadingAnimation />
      ) : (
        <div className=" flex w-full flex-col gap-6">
          <textarea
            onChange={(e) => setNoteState(e.target.value)}
            value={noteState}
            className=" min-h-[150px] resize-y bg-black p-2 text-sm text-white"
          />
          <SecondaryButton
            label="Update"
            onClick={() => {
              updateDebtNote.mutate({ debtId: debtId, text: noteState });
            }}
          />
        </div>
      )}
    </div>
  );
};
