import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Container from "../../container/Container";
import { UserRole } from "@prisma/client";
import { Input, PrimaryButton } from "../../components/utils";
import { useSession } from "next-auth/react";
import { useModalState } from "../../hooks/modalState";
import { useState, type FC, useEffect } from "react";
import { BalanceArr, type ChangeBalanceType } from "../../types/utils.types";

const User = () => {
  const router = useRouter();
  const userId = String(router.query.id);
  const { data: viewerData } = useSession();
  const { openModal } = useModalState((state) => ({
    openModal: state.openModal,
    closeModal: state.closeModal,
  }));

  const { data: userData, refetch } = trpc.user.getUserById.useQuery({
    id: userId,
  });

  if (!userData) {
    return <h1>Cna not find this user</h1>;
  }

  return (
    <div className="flex w-full justify-around ">
      <Container></Container>

      <Container>
        <div className="flex w-full flex-col ">
          <div className="flex w-full justify-between gap-10">
            <div className="flex flex-col items-center justify-center">
              <p className=" rounded-md bg-gray-900 p-4 font-semibold text-white">
                {userData.name}
              </p>
              <span className=" bg-gray-900 py-10 px-1 "></span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <p className=" rounded-md bg-gray-900 p-4 font-semibold text-white">
                {userData?.email}
              </p>
              <span className=" bg-gray-900 py-10 px-1 "></span>
            </div>
          </div>

          <p className=" w-full rounded-md bg-gray-900 p-4 text-center font-semibold text-white">
            {userData.role === UserRole.Admin ? "Admin" : userData.userBalance}
          </p>
        </div>
        {viewerData?.user?.role === UserRole.Admin ? (
          <PrimaryButton
            label="Change Balance"
            onClick={() => {
              openModal({
                newComponents: (
                  <ModalComponent
                    userId={userData.id}
                    currentBalance={userData.userBalance}
                    refetch={() => {
                      refetch();
                    }}
                  />
                ),
              });
            }}
          />
        ) : null}
      </Container>
    </div>
  );
};

export default User;

const ModalComponent: FC<{
  userId: string;
  currentBalance: number;
  refetch: () => void;
}> = ({ userId, currentBalance, refetch }) => {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<ChangeBalanceType>("Add");
  const changeBalance = trpc.user.changeUserBalance.useMutation();
  const { closeModal } = useModalState((state) => ({
    openModal: state.openModal,
    closeModal: state.closeModal,
  }));

  useEffect(() => {
    if (changeBalance.isSuccess) {
      refetch();
      closeModal();
    }
  }, [changeBalance.isSuccess, closeModal, refetch]);

  return (
    <div className=" flex flex-col items-center gap-3 p-3 align-middle">
      <p className=" text-green-800">Current Balance: {currentBalance}</p>
      <div className=" flex items-center gap-1 align-middle">
        <div className="flex flex-col  items-start justify-start">
          <Input
            label="Amount"
            name="amount"
            state={amount}
            onChange={(e) => {
              const result = e.target.value.replace(/\D/g, "");
              setAmount(result);
            }}
          />
        </div>
        <select
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const value = e.target.value as "Add" | "Take";
            setType(value);
          }}
          value={type}
          className=" mt-6 h-8 bg-gray-900 px-1 text-center text-white "
        >
          {BalanceArr.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      {Number(amount) < 5 ? (
        <p className=" text-red-700">Amount must be &gt; 4</p>
      ) : (
        <p className=" text-gray-700">
          {type} {amount} ={" "}
          {type === "Add"
            ? currentBalance + Number(amount)
            : currentBalance - Number(amount)}
        </p>
      )}
      <PrimaryButton
        label="Change Balance"
        onClick={async () => {
          if (Number(amount) >= 5) {
            try {
              changeBalance.mutateAsync({
                userId: userId,
                amount: Number(amount),
                type: type,
              });
            } catch (e) {
              console.log(e);
            }
          }
        }}
      />
    </div>
  );
};
