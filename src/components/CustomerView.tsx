import { type FC, useState, useEffect } from "react";

import Container from "../container/Container";
import {
  DataFields,
  FormInput,
  Input,
  PrimaryButton,
  SecondaryButton,
  Toggle,
} from "./utils";
import type { Customer } from "@prisma/client";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../utils/trpc";
import { useModalState } from "../hooks/modalState";
import { useRouter } from "next/router";
import { SyncLoader } from "react-spinners";

const CustomerForm = z.object({
  name: z.string().min(3),
  number: z.bigint(),
  idNumber: z.bigint().nullable(),
  mobile: z.object({ value: z.bigint().nullable() }).array().max(4),
});
type CustomerFormType = z.infer<typeof CustomerForm>;

const CustomerView: FC<{
  customerData: Customer;
  refetch: () => void;
}> = ({ customerData, refetch }) => {
  const [toggle, setToggle] = useState(false);

  return (
    <Container>
      <Toggle
        state={toggle}
        onChange={(e) => {
          setToggle(e.target.checked);
        }}
      />
      {toggle ? (
        <EditMode customerData={customerData} refetch={refetch} />
      ) : (
        <ViewCustomer customerData={customerData} />
      )}
    </Container>
  );
};

export default CustomerView;

const EditMode: FC<{
  customerData: Customer | null | undefined;
  refetch: () => void;
}> = ({ customerData, refetch }) => {
  const emptyField = { value: null };

  const mobileArr = customerData?.mobile.map((number) => ({ value: number }));
  const updateCustomer = trpc.customer.updateCustomer.useMutation();

  const { openModal } = useModalState((state) => ({
    openModal: state.openModal,
  }));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CustomerFormType>({
    resolver: zodResolver(CustomerForm),
    defaultValues: {
      name: customerData?.name,
      number: customerData?.number,
      idNumber: customerData?.idNumber,
      mobile: mobileArr,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "mobile" });

  const onSub = async (data: CustomerFormType) => {
    const arr = data.mobile.reduce((arr: bigint[], obj) => {
      if (obj.value) {
        arr.push(obj.value);
      }
      return arr;
    }, []);
    try {
      await updateCustomer.mutateAsync({
        name: data.name,
        number: data.number,
        idNumber: data.idNumber,
        mobile: arr,
      });
      refetch();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (updateCustomer.error) {
      openModal({ newText: updateCustomer.error.message });
    }
  }, [openModal, updateCustomer.error]);

  return (
    <form
      onSubmit={handleSubmit(onSub)}
      className=" flex w-full flex-col items-center gap-2"
    >
      <FormInput
        type="text"
        label="Name:"
        name="name"
        error={errors.name?.message}
        register={register("name")}
      />
      <FormInput
        type="number"
        label="Number:"
        name="number"
        error={errors.number?.message}
        register={register("number", {
          setValueAs(value) {
            return Number(value) ? Number(value) : null;
          },
        })}
      />
      <FormInput
        type="number"
        label="ID:"
        name="idNumber"
        error={errors.idNumber?.message}
        register={register("idNumber", {
          setValueAs(value) {
            return Number(value) ? Number(value) : null;
          },
        })}
      />

      {fields.map((item, i) => (
        <div
          key={item.id}
          className=" flex w-full items-end justify-center gap-1"
        >
          <FormInput
            type="number"
            label={`Mobile ${i + 1}:`}
            name="idNumber"
            error={errors.mobile?.message}
            register={register(`mobile.${i}.value`, {
              setValueAs(value) {
                return Number(value) ? Number(value) : null;
              },
            })}
          />
          <div className="">
            <button
              type="button"
              className="bg-red-700 px-3 py-[5px] hover:bg-red-600"
              onClick={() => {
                remove(i);
              }}
            >
              X
            </button>
          </div>
        </div>
      ))}
      <div className="w-1/2 ">
        <SecondaryButton
          label="Add Mobile"
          type="button"
          onClick={() => {
            append(emptyField);
          }}
        />
      </div>
      <PrimaryButton type="submit" label="Edit" />
    </form>
  );
};

const ViewCustomer: FC<{ customerData: Customer }> = ({ customerData }) => {
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
    <div className=" flex w-full flex-col gap-4 ">
      <DataFields label="Name" text={customerData.name} />
      <DataFields label="Number" text={customerData.number} />
      <DataFields label="ID" text={customerData.idNumber} />

      {customerData?.mobile.map((mNumber, i) => (
        <DataFields key={i} label={`Mobile ${i + 1}`} text={mNumber} />
      ))}

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

const ModalComponent: FC<{
  customerData: Customer;
}> = ({ customerData }) => {
  const [cost, setCost] = useState("");

  const router = useRouter();

  const createInvoice = trpc.invoice.makeInvoice.useMutation();

  if (createInvoice.data) {
    router.push(`/invoice/${createInvoice.data.id}`);
  }

  return (
    <div className=" flex flex-col items-center justify-center gap-5  py-5 px-20">
      {createInvoice.isLoading ? (
        <div className="py-10 px-16">
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
