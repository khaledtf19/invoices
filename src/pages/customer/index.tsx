import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";

import { FormInput, PrimaryButton } from "../../components/utils";
import type { CustomerInterface } from "../../types/utils.types";
import { trpc } from "../../utils/trpc";

const customerSchema = z.object({
  name: z.string().min(3),
  number: z.string().min(5),
  idNumber: z.string().nullish(),
  mobile: z.string().nullish(),
});

type CustomerType = z.infer<typeof customerSchema>;

const MakeCustomer: NextPage = () => {
  const mutateCustomer = trpc.customer.createCustomer.useMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerType>({
    resolver: zodResolver(customerSchema),
  });

  const { data: sessionData } = useSession();

  const onsubmit = async (data: CustomerType) => {
    console.log(data);
    const customerData = {
      name: data.name,
      mobile: [Number(data.mobile)],
      number: Number(data.number),
      idNumber: Number(data.idNumber),
    } as CustomerInterface;
    try {
      await mutateCustomer.mutateAsync(customerData);
    } catch (e) {
      console.log(e);
    }
  };

  if (mutateCustomer.error) {
    console.log(mutateCustomer.error.message, "message here");
  }

  if (!sessionData?.user)
    return (
      <div>
        <h1>no</h1>
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit(onsubmit)}
      className=" flex w-full max-w-md flex-col items-center gap-3 self-center rounded-lg border border-indigo-900  p-6 shadow-2xl drop-shadow-xl"
    >
      <h1 className=" text-3xl">Create New Customer</h1>
      <FormInput
        name="name"
        label="Name"
        type="text"
        placeholder="Name"
        register={register("name")}
        error={errors.name?.message}
      />
      <FormInput
        name="number"
        label="Number"
        type="number"
        placeholder="13..."
        register={register("number")}
        error={errors.number?.message}
      />
      <FormInput
        name="idNumber"
        label="ID"
        type="number"
        placeholder="ID"
        register={register("idNumber")}
        error={errors.idNumber?.message}
      />
      <FormInput
        name="mobile"
        label="Mobile"
        type="number"
        placeholder="Mobile"
        register={register("mobile")}
        error={errors.mobile?.message}
      />
      <div className=" w-full max-w-[100px]">
        <PrimaryButton type="submit" label="Add" />
      </div>
    </form>
  );
};

export default MakeCustomer;
