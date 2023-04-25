import Image from "next/image";
import { type TransactionTypes, type BankName } from "@prisma/client";
import Container from "../container/Container";
import { useModalState } from "../hooks/modalState";
import { trpc } from "../utils/trpc";
import { useEffect, useState } from "react";
import { BankNameArr, TransactionsArr } from "../types/utils.types";
import { LoadingAnimation } from "../components/utils";

const Bank = () => {
  const { data: bankData } = trpc.user.getBank.useQuery();
  const { data: bankChangeData } = trpc.user.getBankChange.useQuery();
  const { openModal, closeModal } = useModalState((state) => ({
    openModal: state.openModal,
    closeModal: state.closeModal,
  }));

  useEffect(() => {
    return () => {
      closeModal();
    };
  }, [closeModal]);

  return (
    <div className="flex h-full w-full flex-col items-center gap-4">
      <Container>
        <div className="flex w-full  items-center gap-6">
          <div className="flex w-full flex-col items-center gap-1">
            <Image src="/we_logo.png" alt="we logo" width={50} height={50} />

            <p>Bss: {bankData?.bss}</p>
            <button
              className="rounded-md bg-purple-900 p-2 text-white hover:bg-purple-800"
              onClick={() =>
                openModal({
                  newComponents: (
                    <BankModal bankNameType="Bss" transactionType="Add" />
                  ),
                })
              }
            >
              Change
            </button>
          </div>
          <div className="flex w-full flex-col items-center gap-1">
            <div className=" bg-blue-900 p-1 text-white">
              <Image
                src="/khadmaty_logo.png"
                alt="we logo"
                width={96}
                height={40}
              />
            </div>
            <p>Khadmaty: {bankData?.khadmaty}</p>
            <button
              className="rounded-md bg-blue-900 p-2 text-white hover:bg-blue-800"
              onClick={() =>
                openModal({
                  newComponents: (
                    <BankModal bankNameType="Khadmaty" transactionType="Add" />
                  ),
                })
              }
            >
              Change
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Bank;

export const BankModal: React.FC<{
  bankNameType?: BankName;
  transactionType?: TransactionTypes;
  invoiceId?: string;
}> = ({ bankNameType, transactionType, invoiceId }) => {
  const [amount, setAmount] = useState(0);
  const [bankName, setBankName] = useState(bankNameType || BankNameArr[0]);
  const [transaction, setTransaction] = useState(transactionType || "Add");

  const { closeModal } = useModalState((state) => ({
    closeModal: state.closeModal,
  }));

  const ctx = trpc.useContext();

  const changeBank = trpc.user.changeBank.useMutation({
    onSuccess: () => {
      ctx.user.getBank.invalidate();
      ctx.user.getBankChange.invalidate();
      closeModal();
    },
  });

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {bankName === "Bss" ? (
        <div className=" ">
          <Image src="/we_logo.png" alt="we logo" width={50} height={50} />
        </div>
      ) : (
        <div className=" bg-blue-900 p-1 text-white">
          <Image
            src="/khadmaty_logo.png"
            alt="we logo"
            width={96}
            height={40}
          />
        </div>
      )}
      <select
        onChange={(e) => setBankName(e.target.value as BankName)}
        value={bankName}
        className="rounded-md border border-gray-300 p-2"
      >
        {BankNameArr.map((name) => (
          <option key={name}>{name}</option>
        ))}
      </select>
      <div className="flex w-full items-center justify-center gap-1">
        <input
          className="rounded-md border border-gray-300 p-2"
          type="number"
          onChange={(e) => {
            setAmount(Number(e.target.value));
          }}
        />
        <select
          onChange={(e) => setTransaction(e.target.value as TransactionTypes)}
          value={transaction}
          className="rounded-md border border-gray-300 px-1 py-2"
        >
          {TransactionsArr.map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
      </div>

      {!Number(amount) ? (
        <p className="text-xl text-red-500">Must be a Number</p>
      ) : (
        <p
          className={`text-xl ${
            transaction === "Add" ? "text-green-600" : "text-red-600"
          }`}
        >
          {transaction === "Add" ? "+" : "-"} {amount}{" "}
          {transaction === "Add" ? "to" : "from"} {bankName}
        </p>
      )}
      <button
        className={`w-1/4 rounded-md py-2 text-white ${
          bankName === "Bss"
            ? "bg-purple-900 hover:bg-purple-800"
            : "bg-blue-900 hover:bg-blue-800"
        }`}
        onClick={async () => {
          if (Number(amount)) {
            changeBank.mutate({
              transactionType: transaction,
              amount,
              bankName,
              invoiceId,
            });
          }
        }}
      >
        {changeBank.isLoading ? <LoadingAnimation color="#fff" /> : transaction}
      </button>
    </div>
  );
};
