import { type BankName, type TransactionTypes } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";

import ChangeBankTable from "../components/tables/ChangeBankTable";
import { LoadingAnimation, PrimaryButton } from "../components/utils";
import Container from "../container/Container";
import { useModalState } from "../hooks/modalState";
import { BankNameArr, TransactionsArr } from "../types/utils.types";
import { trpc } from "../utils/trpc";

const Bank = () => {
  const { data: bankData } = trpc.bank.getBank.useQuery();
  const { data: bankChangeData } = trpc.bank.getBankChange.useQuery();
  const { openModal, closeModal } = useModalState((state) => ({
    openModal: state.openModal,
    closeModal: state.closeModal,
  }));

  const getBankChangesAtDate = trpc.bank.getBankdataAtaDate.useMutation();

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
        <div>
          <PrimaryButton
            label="Get"
            onClick={() => {
              console.log(new Date().toISOString());
              getBankChangesAtDate.mutate({
                dateMax: new Date().toISOString(),
                dateMin: new Date("5/3/2023").toISOString(),
              });
            }}
          />
          {getBankChangesAtDate.data}
        </div>
      </Container>
      {bankChangeData && <ChangeBankTable changeBank={bankChangeData} />}
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
  const [bankName, setBankName] = useState(bankNameType || BankNameArr[1]);
  const [transaction, setTransaction] = useState(transactionType || "Add");

  const { closeModal } = useModalState((state) => ({
    closeModal: state.closeModal,
  }));

  const ctx = trpc.useUtils();

  const changeBank = trpc.bank.changeBank.useMutation({
    onSuccess: () => {
      ctx.bank.getBank.invalidate();
      ctx.bank.getBankChange.invalidate();
      ctx.invoice.getInvoiceById.invalidate();
      closeModal();
    },
  });

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex h-[50px] w-full items-center justify-center">
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
      </div>
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
          autoFocus={true}
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
        disabled={!Number(amount)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            changeBank.mutate({
              transactionType: transaction,
              amount,
              bankName,
              invoiceId,
            });
          }
        }}
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
