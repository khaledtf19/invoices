import { useState, type FC, useEffect, Ref, useRef, useCallback } from "react";
import Container from "../container/Container";
import {
  DataFields,
  Input,
  LoadingAnimation,
  PrimaryButton,
  RedButton,
  SecondaryButton,
} from "./utils";
import type { InvoiceStatusEnum } from "@prisma/client";
import { DateFormat } from "../utils/utils";
import { InvoiceStatusArr, UserRoleArr } from "../types/utils.types";
import { type RouterOutputs, trpc } from "../utils/trpc";
import { useModalState } from "../hooks/modalState";
import { useRouter } from "next/router";
import { useUserState } from "../hooks/userDataState";
import CustomerDebtComponent from "./customer/CustomerDebt";
import { BankModal } from "../pages/bank";
import ReactToPrint from "react-to-print";
import {
  BsFillTelephoneFill,
  BsFillPersonBadgeFill,
  BsCalendarDate,
  BsBank2
} from "react-icons/bs";
import { BiMobile } from "react-icons/bi";
import { AiFillDollarCircle } from "react-icons/ai"
import { FaUserSecret } from "react-icons/fa"

const InvoiceView: FC<{
  invoiceData: RouterOutputs["invoice"]["getInvoiceById"];
  refetch: () => void;
}> = ({ invoiceData, refetch }) => {
  const [newStatus, setNewStatus] = useState(invoiceData.invoiceStatus?.status);

  const [newStatusNote, setNewStatusNote] = useState(
    invoiceData.invoiceStatus?.note
  );

  const printComponentRef = useRef(null);

  const { openModal, closeModal } = useModalState((state) => ({
    openModal: state.openModal,
    closeModal: state.closeModal,
  }));

  const ctx = trpc.useContext();

  const { userData } = useUserState()((state) => ({ userData: state.user }));

  const editInvoice = trpc.invoice.updateInvoiceStatus.useMutation({
    onSuccess: () => {
      ctx.invoice.getInvoiceById.invalidate();
    },
  });

  useEffect(() => {
    if (editInvoice.error) {
      openModal({ newText: editInvoice.error.message });
    }
  }, [editInvoice.error, openModal]);

  useEffect(() => {
    return () => {
      closeModal();
    };
  }, [closeModal]);

  const reactToPrintContent = useCallback(() => {
    return printComponentRef.current;
  }, [printComponentRef.current]);

  const reactToPrintTrigger = useCallback(() => {

    return <PrimaryButton label="print" />
  }, []);

  return (
    <Container
      size="max-w-md"
      rightComponent={
        <CustomerDebtComponent
          customerId={invoiceData.customerId}
          debtData={invoiceData.customer.customerDebt}
          refetch={() => {
            refetch();
          }}
        />
      }
      openRight={invoiceData.customer.customerDebt.length > 0 ? true : false}
    >
      <DataFields label="Name" text={invoiceData.customer.name} Icon={BsFillPersonBadgeFill} />
      <DataFields label="Number" text={invoiceData.customer.number} Icon={BsFillTelephoneFill} />
      <DataFields label='Cost' text={invoiceData.cost} Icon={AiFillDollarCircle} />
      <DataFields
        label="Created At"
        text={DateFormat({ date: invoiceData.createdAt })}
        Icon={BsCalendarDate}
      />
      <DataFields Icon={FaUserSecret} label="Created By" text={invoiceData.madeBy.name} />
      {invoiceData.bankChange.map((bankChange) => (
        <div className="flex w-full gap-1 items-end justify-center " key={bankChange.id}>
          <DataFields
            key={bankChange.id}
            label={`${bankChange.bankName} cost`}
            text={"- " + bankChange.amount}
            className=" text-red-700"
            Icon={BsBank2}
          />
          <div>
            <RedButton label="X" onClick={() => {
              openModal({ newComponents: <ModalUndoBankChange bankChangeId={bankChange.id} /> })
            }} />
          </div>
        </div>
      ))
      }
      <div
        className={` w-full ${newStatus === InvoiceStatusArr[1]
          ? "text-red-700"
          : newStatus === InvoiceStatusArr[2]
            ? "text-green-700"
            : "text-blue-700"
          } `}
      >
        {userData?.role === UserRoleArr[1] ? (
          <>
            <label className=" text-gray-700">Status:</label>
            <select
              className=" w-full bg-gray-200 p-1"
              value={newStatus}
              onChange={(e) => {
                setNewStatus(e.target.value as InvoiceStatusEnum);
              }}
            >
              {InvoiceStatusArr.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </>
        ) : (
          <DataFields
            label="Status"
            text={String(invoiceData.invoiceStatus?.status)}
          />
        )}
      </div>

      {
        userData?.role === UserRoleArr[1] ? (
          <div className='w-full'>
            <Input
              label="Status Note"
              state={newStatusNote ? newStatusNote : ""}
              onChange={(e) => {
                setNewStatusNote(e.target.value);
              }}
            />
          </div>
        ) : invoiceData.invoiceStatus?.note ? (
          <DataFields
            label="Status Note"
            text={invoiceData.invoiceStatus?.note}
          />
        ) : null
      }

      {
        userData?.role === UserRoleArr[1] && (
          <>
            <ReactToPrint content={reactToPrintContent} trigger={reactToPrintTrigger} removeAfterPrint />
            <div className="flex gap-3 w-full">
              <PrimaryButton
                label="Edit"
                onClick={async () => {
                  editInvoice.mutateAsync({
                    invoiceId: invoiceData.id,
                    invoiceStatus: newStatus,
                    invoiceStatusNote: newStatusNote,
                  });
                }}
              />
              <SecondaryButton
                label="Add to Bank"
                onClick={() => {
                  openModal({
                    newComponents: (
                      <BankModal
                        transactionType="Take"
                        invoiceId={invoiceData.id}
                      />
                    ),
                  });
                }}
              />

            </div>
            <div className="w-2/3">
              <RedButton
                label="Delete"
                onClick={() => {
                  openModal({
                    newComponents: (
                      <ModalDeleteComponent
                        invoiceId={invoiceData.id}
                        customerId={invoiceData.customerId}
                      />
                    ),
                  });
                }}
              />
            </div>
          </>
        )
      }
      <div className=" hidden" ><PrintInvlicieComponent refC={printComponentRef} invoiceData={invoiceData} /></div>
    </Container >
  );
};

export default InvoiceView;

const ModalDeleteComponent: FC<{ invoiceId: string; customerId: string }> = ({
  invoiceId,
  customerId,
}) => {
  const router = useRouter();
  const deleteInvoice = trpc.invoice.deleteInvoice.useMutation();

  useEffect(() => {
    if (deleteInvoice.isSuccess) {
      router.push(`/customer/${customerId}`);
    }
  }, [customerId, deleteInvoice.isSuccess, router]);

  useEffect(() => {
    if (deleteInvoice.error) {
      console.log(deleteInvoice.error.message);
    }
  }, [deleteInvoice.error]);

  if (deleteInvoice.isLoading) {
    return (
      <div className=' pt-5'>
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className=" flex h-52 w-full flex-col items-center">
      <div className=" h-full">
        <p className=" text-lg font-bold text-red-700">
          Do you want to delete this invoice
        </p>
      </div>
      <div className=" mb-1 w-2/4">
        <RedButton
          label="Delete"
          onClick={async () => {
            try {
              await deleteInvoice.mutateAsync({ invoiceId: invoiceId });
            } catch (e) {
              console.log(e);
            }
          }}
        />
      </div>
    </div>
  );
};

const ModalUndoBankChange: FC<{ bankChangeId: string }> = ({ bankChangeId }) => {
  const ctx = trpc.useContext()

  const undoBankChange = trpc.bank.undoBankChange.useMutation({
    onSuccess: () => {
      ctx.invoice.getInvoiceById.invalidate();
      ctx.bank.getBank.invalidate();
    },
  })


  if (undoBankChange.isLoading) {
    return (
      <div className=" pt-5">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className=" flex h-52 w-full flex-col items-center">
      <div className=" h-full">
        <p className=" text-lg font-bold text-red-700">
          Do you want to undo this bank change
        </p>
      </div>
      <div className=" mb-1 w-2/4">
        <RedButton
          label="Undo"
          onClick={() => {
            undoBankChange.mutate({
              id: bankChangeId,
            });
          }}
        />
      </div>
    </div>
  );
};


const PrintInvlicieComponent: FC<{ invoiceData: RouterOutputs["invoice"]["getInvoiceById"]; refC: Ref<HTMLDivElement> }> = ({ invoiceData, refC }) => {
  return <div ref={refC} className="flex flex-col justify-center w-full items-center h-full text-sm ">
    <div className="flex flex-col justify-center items-center w-[26%]  h-full gap-3">
      <DataFields label="Name" text={invoiceData.customer.name} Icon={BsFillPersonBadgeFill} iconSize={15} />
      <DataFields label="Number" text={invoiceData.customer.number} Icon={BsFillTelephoneFill} iconSize={15} />
      <DataFields label="Cost" text={invoiceData.cost} Icon={AiFillDollarCircle} iconSize={15} />
      <DataFields label="Created At" text={DateFormat({ date: invoiceData.createdAt })} Icon={BsCalendarDate} iconSize={15} />
      <DataFields label="Created By" text={invoiceData.madeBy.name} Icon={FaUserSecret} iconSize={15} />
      <div className="justify-self-end mt-40 w-full">
        <DataFields label="موبايل لبيب حبش" text="01287591751" Icon={BiMobile} iconSize={15} />
        <DataFields label="موبايل لبيب حبش" text="01114800992" Icon={BiMobile} iconSize={15} />
        <DataFields label="ارضي لبيب حبش" text="0132428421" Icon={BsFillTelephoneFill} iconSize={15} />
        <DataFields label="ارضي لبيب حبش" text="0132421822" Icon={BsFillTelephoneFill} iconSize={15} />
      </div>
    </div>
  </div>;
}
