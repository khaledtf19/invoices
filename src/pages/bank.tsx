import Image from "next/image";
import { type BankName } from "@prisma/client";
import Container from "../container/Container";
import { useModalState } from "../hooks/modalState";
import { trpc } from "../utils/trpc";
import { useState } from "react";
import { BankNameArr } from "../types/utils.types";

const Bank = () => {
  const { data: bankData } = trpc.user.getBank.useQuery();
  const { data: bankChangeData } = trpc.user.getBankChange.useQuery();
  const { openModal } = useModalState((state) => ({
    openModal: state.openModal,
  }));

  return (
    <Container>
      <div className="flex w-full flex-col items-center gap-6">
        <div>Bank</div>
        <div className="flex w-full flex-col items-center gap-1">
          <Image src="/we_logo.png" alt="we logo" width={50} height={50} />

          <p>Bss: {bankData?.bss}</p>
          <button
            className="rounded-md bg-purple-900 p-2 text-white hover:bg-purple-800"
            onClick={() =>
              openModal({ newComponents: <BankModal type="Bss" /> })
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
              height={96}
            />
          </div>
          <p>Khadmaty: {bankData?.khadmaty}</p>
          <button
            className="rounded-md bg-blue-900 p-2 text-white hover:bg-blue-800"
            onClick={() =>
              openModal({ newComponents: <BankModal type="Khadmaty" /> })
            }
          >
            Change
          </button>
        </div>
      </div>
    </Container>
  );
};

export default Bank;

const BankModal: React.FC<{ type?: BankName }> = ({ type }) => {
  const [amount, setAmount] = useState(0);
  const [bankName, setBankName] = useState(type || BankNameArr[0]);
  const changeBank = trpc.user.changeBank.useMutation();

  return (
    <div className="flex flex-col items-center gap-4">
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
            height={96}
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
      <input
        className="rounded-md border border-gray-300 p-2"
        type="number"
        onChange={(e) => {
          setAmount(Number(e.target.value));
        }}
      />
      {!Number(amount) && <p className="text-red-500">Must be a Number</p>}
    </div>
  );
};
