import { type FC, useState, useEffect } from "react";
import { type Customer, UserRole } from "@prisma/client";
import { useRouter } from "next/router";

import { SyncLoader } from "react-spinners";

import { DataFields, IconToCopy, Input, PrimaryButton } from "../utils";
import { trpc } from "../../utils/trpc";
import { useModalState } from "../../hooks/modalState";
import {
  BsCreditCard2Front,
  BsFillTelephoneFill,
  BsFillPersonBadgeFill,
  BsCalendarDate,
} from "react-icons/bs";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { BiMobile } from "react-icons/bi";
import { useUserState } from "../../hooks/userDataState";

const CustomerData: FC<{ customerData: Customer }> = ({ customerData }) => {
  const { openModal, closeModal } = useModalState((state) => ({
    openModal: state.openModal,
    closeModal: state.closeModal,
  }));
  const { user } = useUserState()((state) => state);

  useEffect(() => {
    return () => {
      closeModal();
    };
  }, [closeModal]);

  return (
    <div className=" flex w-full flex-col gap-4 ">
      <DataFields
        label="Name"
        text={customerData.name}
        Icon={BsFillPersonBadgeFill}
      />
      <DataFields
        label="Number"
        text={customerData.number}
        Icon={BsFillTelephoneFill}
      />
      <DataFields
        label="Address"
        text={customerData.address}
        Icon={MdOutlineAlternateEmail}
      />

      {user?.role === UserRole.Admin ? (
        <div className=" flex justify-between px-10">
          <IconToCopy
            name="ID"
            text={String(customerData.idNumber)}
            Icon={BsCreditCard2Front}
          />
          <IconToCopy
            name="birthday"
            text={String(customerData.birthday)}
            Icon={BsCalendarDate}
          />
          {customerData?.mobile.map((mNumber, i) => (
            <IconToCopy
              key={i}
              name={`Mobile${i + 1}`}
              text={String(mNumber)}
              Icon={BiMobile}
            />
          ))}
        </div>
      ) : (
        ""
      )}

      <PrimaryButton
        type="button"
        label="Create Invoice"
        onClick={() => {
          openModal({
            newComponents: <ModalComponent customerData={customerData} />,
          });
        }}
      />
    </div>
  );
};

export default CustomerData;

const ModalComponent: FC<{
  customerData: Customer;
}> = ({ customerData }) => {
  const [cost, setCost] = useState("");

  const { refetch } = useUserState()((state) => ({
    refetch: state.refetchUserData,
  }));

  const router = useRouter();

  const createInvoice = trpc.invoice.makeInvoice.useMutation();

  if (createInvoice.data) {
    router.push(`/invoice/${createInvoice.data.id}`);
  }

  useEffect(() => {
    return refetch();
  }, [refetch]);

  return (
    <div className=" flex flex-col items-center justify-center gap-5  px-20 py-5">
      {createInvoice.isLoading ? (
        <div className="px-16 py-10">
          <SyncLoader color="#312e81" />
        </div>
      ) : (
        <>
          <div className="">
            <Input
              label="Const"
              name="const"
              state={cost}
              onChange={(e) => {
                setCost(e.target.value);
              }}
            />
            {Number(cost) ? (
              <p></p>
            ) : (
              <p className=" text-red-700">MUST BE A NUMBER</p>
            )}
          </div>
          <div className="w-2/3">
            <PrimaryButton
              type="button"
              label="Create Invoice"
              onClick={async () => {
                if (Number(cost) && customerData?.id) {
                  try {
                    await createInvoice.mutateAsync({
                      customerId: customerData?.id,
                      cost: Number(cost),
                    });
                  } catch (e) {
                    console.log(e);
                  }
                }
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};
