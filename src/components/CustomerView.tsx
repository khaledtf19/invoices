import { type FC, type ReactNode, useState } from "react";

import Container from "../container/Container";
import {
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
import { BigNumberLength } from "../utils/utils";
import { useModalState } from "../hooks/modalState";

const CustomerForm = z.object({
  name: z.string().min(3),
  number: z.number().lte(BigNumberLength).min(999999),
  idNumber: z.number().lte(BigNumberLength).nullable(),
  mobile: z
    .object({ value: z.number().lte(BigNumberLength).nullable() })
    .array()
    .max(4),
});
type CustomerFormType = z.infer<typeof CustomerForm>;

const CustomerView: FC<{
  customerData: Customer | null | undefined;
  refetch: () => void;
}> = ({ customerData, refetch }) => {
  // const [customerState, setCustomerState] = useState(
  //   structuredClone(customerData) as Customer
  // );

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
    const arr = data.mobile.reduce((arr: number[], obj) => {
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
    console.log("hi", data);
  };

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

const ViewCustomer: FC<{ customerData: Customer | null | undefined }> = ({
  customerData,
}) => {
  const { openModal } = useModalState((state) => ({
    openModal: state.openModal,
  }));

  return (
    <div className=" flex w-full flex-col gap-4 ">
      <CustomerFields label="Name">{customerData?.name}</CustomerFields>

      <CustomerFields label="Number">{customerData?.number}</CustomerFields>

      <CustomerFields label="ID">{customerData?.idNumber}</CustomerFields>

      {customerData?.mobile.map((mNumber, i) => (
        <CustomerFields key={i} label={`Mobile ${i + 1}`}>
          {mNumber}
        </CustomerFields>
      ))}

      <PrimaryButton
        type="button"
        label="Create Invoice"
        onClick={() => {
          openModal({
            newComponents: <ModalComponent />,
          });
        }}
      />
    </div>
  );
};

const CustomerFields: FC<{ children: ReactNode; label: string }> = ({
  children,
  label,
}) => {
  return (
    <div className=" flex w-full flex-col ">
      <label className=" text-gray-700">{label}:</label>
      <p className=" bg-gray-200 p-1 ">{children}</p>
    </div>
  );
};

const ModalComponent: FC = () => {
  const [cost, setCost] = useState("");

  return (
    <div className=" p-10">
      <Input
        label="Const"
        name="const"
        state={cost}
        onChange={(e) => {
          setCost(e.currentTarget.value);
        }}
      />
    </div>
  );
};
