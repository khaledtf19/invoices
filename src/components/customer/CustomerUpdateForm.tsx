import { zodResolver } from "@hookform/resolvers/zod";
import { type Customer } from "@prisma/client";
import { type FC, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { useModalState } from "../../hooks/modalState";
import { trpc } from "../../utils/trpc";
import { FormInput, PrimaryButton, SecondaryButton } from "../utils";

const CustomerForm = z.object({
  name: z.string().min(3),
  number: z.string().min(8),
  idNumber: z.string().nullable().nullable(),
  birthday: z.string().optional().nullable(),
  address: z.string().optional().nullish(),
  mobile: z
    .object({
      value: z.string().min(8).optional().nullable(),
    })
    .array()
    .max(4),
});
type CustomerFormType = z.infer<typeof CustomerForm>;

const CustomerUpdateForm: FC<{
  customerData: Customer;
  refetch: () => void;
}> = ({ customerData, refetch }) => {
  const emptyField = { value: "" };

  const mobileArr = customerData?.mobile
    ?.split(",")
    .map((number) => ({ value: number }));
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
      name: customerData.name,
      number: customerData.number,
      idNumber: customerData?.idNumber ? customerData?.idNumber : "",
      address: customerData.address,
      birthday: customerData.birthday,
      mobile: mobileArr,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "mobile" });

  const onSub = async (data: CustomerFormType) => {
    const arr = data.mobile.reduce((arr: string[], obj) => {
      if (obj.value) {
        arr.push(obj.value);
      }
      return arr;
    }, []);
    try {
      await updateCustomer.mutateAsync({
        id: customerData.id,
        name: data.name,
        number: data.number,
        address: data.address,
        idNumber: data.idNumber,
        birthday: data.birthday,
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
    // console.log(errors.mobile?.[1]);
  }, [openModal, updateCustomer.error]);

  return (
    <form
      onSubmit={handleSubmit(onSub)}
      className=" flex w-full flex-col items-center gap-2 "
    >
      <FormInput
        type="text"
        label="Name"
        name="name"
        error={errors.name?.message}
        register={register("name")}
      />
      <FormInput
        type="number"
        label="Number"
        name="number"
        error={errors.number?.message}
        register={register("number", {
          setValueAs(value) {
            return value.replace(/\D/g, "");
          },
        })}
      />
      <FormInput
        type="address"
        label="Address"
        name="address"
        error={errors.number?.message}
        register={register("address")}
      />
      <FormInput
        type="number"
        label="ID"
        name="idNumber"
        error={errors.idNumber?.message}
        register={register("idNumber", {
          setValueAs(value) {
            return value.replace(/\D/g, "");
          },
        })}
      />
      <FormInput
        type="birthday"
        label="Birthday"
        name="birthday"
        error={errors.birthday?.message}
        register={register("birthday")}
      />

      {fields.map((item, i) => (
        <div
          key={item.id}
          className=" flex w-full items-end justify-center gap-1"
        >
          <FormInput
            type="number"
            label={`Mobile ${i + 1}`}
            name="idNumber"
            error={errors.mobile?.[i]?.value?.message}
            register={register(`mobile.${i}.value`, {
              setValueAs(value) {
                return value.replace(/\D/g, "");
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
            if (fields.length < 4) {
              append(emptyField);
            }
          }}
        />
      </div>
      <PrimaryButton type="submit" label="Edit" />
    </form>
  );
};

export default CustomerUpdateForm;
