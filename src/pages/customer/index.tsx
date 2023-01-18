import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";

import {
  FormInput,
  LoadingAnimation,
  PrimaryButton,
} from "../../components/utils";
import type { CustomerInterface } from "../../types/utils.types";
import { trpc } from "../../utils/trpc";
import Container from "../../container/Container";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useModalState } from "../../hooks/modalState";

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

  const router = useRouter();
  const { data: sessionData } = useSession();
  const { openModal } = useModalState((state) => ({
    openModal: state.openModal,
  }));

  const onsubmit = async (data: CustomerType) => {
    console.log(data);
    const customerData = {
      name: data.name,
      mobile: [Number(data.mobile)],
      number: Number(data.number) ? Number(data.number) : null,
      idNumber: Number(data.idNumber) ? Number(data.idNumber) : null,
    } as CustomerInterface;
    try {
      await mutateCustomer.mutateAsync(customerData);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (mutateCustomer.isSuccess) {
      router.push(`/customer/${mutateCustomer.data.id}`);
    }

    if (mutateCustomer.error) {
      openModal({ newText: mutateCustomer.error.message });
    }
  }, [
    mutateCustomer.data?.id,
    mutateCustomer.error,
    mutateCustomer.isSuccess,
    openModal,
    router,
  ]);

  if (mutateCustomer.error) {
    console.log(mutateCustomer.error.message, "message here");
  }

  if (!sessionData?.user)
    return (
      <div>
        <h1>Can not show this</h1>
      </div>
    );

  if (mutateCustomer.isLoading) {
    return (
      <Container>
        <LoadingAnimation />
      </Container>
    );
  }
  return (
    <form
      onSubmit={handleSubmit(onsubmit)}
      className="flex w-full flex-col items-center"
    >
      <Container>
        <h1 className="text-3xl">Create New Customer</h1>
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
      </Container>
    </form>
  );
};

export default MakeCustomer;
