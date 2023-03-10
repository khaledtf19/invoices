import { useState, type FC, useEffect } from "react";
import Container from "../container/Container";
import {
  DataFields,
  Input,
  LoadingAnimation,
  PrimaryButton,
  RedButton,
} from "./utils";
import type {
  InvoiceStatus,
  Customer,
  Invoice,
  InvoiceNote,
  User,
  InvoiceStatusEnum,
  Transaction,
} from "@prisma/client";
import { DateFormat } from "../utils/utils";
import { InvoiceStatusArr, UserRoleArr } from "../types/utils.types";
import { trpc } from "../utils/trpc";
import { useModalState } from "../hooks/modalState";
import { useRouter } from "next/router";
import { useUserState } from "../hooks/userDataState";

const InvoiceView: FC<{
  invoiceData: Invoice & {
    invoiceStatus: InvoiceStatus | null;
    customer: Customer;
    transaction: Transaction | null;
    invoiceNotes: InvoiceNote[];
    madeBy: User;
  };
  refetch: () => void;
}> = ({ invoiceData, refetch }) => {
  const [newStatus, setNewStatus] = useState(invoiceData.invoiceStatus?.status);
  const [newStatusNote, setNewStatusNote] = useState(
    invoiceData.invoiceStatus?.note
  );
  const { openModal, closeModal } = useModalState((state) => ({
    openModal: state.openModal,
    closeModal: state.closeModal,
  }));

  const { userData } = useUserState()((state) => ({ userData: state.user }));

  const editInvoice = trpc.invoice.updateInvoiceStatus.useMutation();

  useEffect(() => {
    if (editInvoice.isSuccess) {
      refetch();
    }
    if (editInvoice.error) {
      openModal({ newText: editInvoice.error.message });
    }
    return () => {
      closeModal();
    };
  }, [
    closeModal,
    editInvoice.error,
    editInvoice.isSuccess,
    openModal,
    refetch,
  ]);

  return (
    <Container size="max-w-md">
      <DataFields label="Name" text={invoiceData.customer.name} />
      <DataFields label="Number" text={invoiceData.customer.number} />
      <DataFields label="Cost" text={invoiceData.cost} />
      <DataFields
        label="Created At"
        text={DateFormat({ date: invoiceData.createdAt })}
      />
      <DataFields
        label="updated At"
        text={DateFormat({ date: invoiceData.updatedAt })}
      />
      <DataFields label="Created By" text={invoiceData.madeBy.name} />
      <DataFields
        label="Viewed"
        text={
          invoiceData.transaction?.viewed
            ? "Seen by an Admin"
            : "Waiting an Admin"
        }
      />
      <div
        className={` w-full ${
          newStatus === InvoiceStatusArr[1]
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

      {userData?.role === UserRoleArr[1] ? (
        <div className=" w-full">
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
      ) : null}

      {userData?.role === UserRoleArr[1] ? (
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
      ) : null}

      {userData?.role === UserRoleArr[1] && (
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
      )}
    </Container>
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
      <div className=" pt-5">
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
