import { type FC, useState, useEffect } from "react";
import { type Customer, UserRole } from "@prisma/client";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

import { SyncLoader } from "react-spinners";

import Container from "../container/Container";
import {
  DataFields,
  FormInput,
  IconToCopy,
  Input,
  PrimaryButton,
  SecondaryButton,
  Toggle,
} from "./utils";
import { z } from "zod";
import { trpc } from "../utils/trpc";
import { useModalState } from "../hooks/modalState";
import {
  BsCreditCard2Front,
  BsFillTelephoneFill,
  BsFillPersonBadgeFill,
  BsCalendarDate,
} from "react-icons/bs";
import { BiMobile } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { useUserState } from "../hooks/userDataState";

const CustomerForm = z.object({
  name: z.string().min(3),
  number: z.bigint().refine((ph: bigint) => ph.toString().length > 8, {
    message: "must be > 8",
  }),
  idNumber: z
    .bigint()
    .refine((ph: bigint) => ph.toString().length > 8, {
      message: "must be > 8",
    })
    .nullable(),
  birthday: z.string().optional(),
  mobile: z
    .object({
      value: z
        .bigint()
        .refine((ph: bigint) => ph.toString().length > 8, {
          message: "must be > 8",
        })
        .nullable(),
    })
    .array()
    .max(4),
});
type CustomerFormType = z.infer<typeof CustomerForm>;

const CustomerView: FC<{
  customerData: Customer;
  refetch: () => void;
}> = ({ customerData, refetch }) => {
  const [toggle, setToggle] = useState(false);

  const { data: userData } = useSession();

  return (
    <div className=" w-full max-w-md">
      <Container>
        {userData?.user?.role === UserRole.Admin ? (
          <Toggle
            state={toggle}
            onChange={(e) => {
              setToggle(e.target.checked);
            }}
          />
        ) : (
          ""
        )}
        {toggle && userData?.user?.role === UserRole.Admin ? (
          <EditMode customerData={customerData} refetch={refetch} />
        ) : (
          <ViewCustomer customerData={customerData} />
        )}
      </Container>
    </div>
  );
};

export default CustomerView;

const EditMode: FC<{
  customerData: Customer;
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
      name: customerData.name,
      number: customerData.number,
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
        id: customerData.id,
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
            return value ? BigInt(value) : null;
          },
        })}
      />
      <FormInput
        type="number"
        label="ID"
        name="idNumber"
        error={errors.idNumber?.message}
        register={register("idNumber", {
          setValueAs(value) {
            return value ? BigInt(value) : null;
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
                return value ? (BigInt(value) ? BigInt(value) : null) : "";
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

export const ViewCustomer: FC<{ customerData: Customer }> = ({
  customerData,
}) => {
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
        label="birthday"
        text={customerData.birthDay}
        Icon={BsCalendarDate}
      />
      {user?.role === UserRole.Admin ? (
        <div className=" flex justify-between px-10">
          <IconToCopy
            name="ID"
            text={String(customerData.idNumber)}
            Icon={BsCreditCard2Front}
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
