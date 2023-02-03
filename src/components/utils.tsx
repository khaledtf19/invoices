import type { ChangeEventHandler, FC, HTMLInputTypeAttribute } from "react";
import type {
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFormRegisterReturn,
} from "react-hook-form";
import { SyncLoader } from "react-spinners";
import { ViewCustomer } from "./CustomerView";
import { LoadingTable } from "./tables";
import Container from "../container/Container";

export const Input: FC<{
  name?: string;
  label: string;
  state: string;
  placeholder?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  type?: HTMLInputTypeAttribute;
}> = ({ name, label, state, onChange, placeholder, type }) => {
  return (
    <div className="flex flex-col">
      <label className="text-gray-700" htmlFor={name}>
        {label}:
      </label>
      <input
        type={type ? type : ""}
        name={name}
        value={state}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-gray-900 p-1 outline-none "
      />
    </div>
  );
};

export const FormInput: FC<{
  name: string;
  label: string;
  register: UseFormRegisterReturn<string>;
  error?:
    | string
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined;
  placeholder?: string;
  type: HTMLInputTypeAttribute;
}> = ({ name, label, register, error, type, placeholder }) => {
  return (
    <div className="flex w-full flex-col">
      <label className="text-gray-700" htmlFor={name}>
        {label}:
      </label>
      <p className=" text-xs">{error ? String(error) : ""}</p>
      <input
        type={type}
        placeholder={placeholder}
        className=" border border-indigo-900 p-1 outline-none "
        {...register}
      />
    </div>
  );
};

export const PrimaryButton: FC<{
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}> = ({ type, label, onClick }) => {
  return (
    <button
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      type={type ? type : "button"}
      className=" w-full rounded-lg bg-gray-900 px-3 py-1 text-white hover:bg-gray-800"
    >
      {label}
    </button>
  );
};
export const SecondaryButton: FC<{
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
}> = ({ type, label, onClick }) => {
  return (
    <button
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      type={type ? type : "button"}
      className=" w-full rounded-lg bg-gray-600 px-3 py-1 text-white hover:bg-gray-500"
    >
      {label}
    </button>
  );
};

export const RedButton: FC<{
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
}> = ({ type, label, onClick }) => {
  return (
    <button
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      type={type ? type : "button"}
      className=" w-full rounded-lg bg-red-800 px-3 py-1 text-white hover:bg-red-700"
    >
      {label}
    </button>
  );
};

export const Toggle: FC<{
  state?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}> = ({ state, onChange }) => {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        checked={state}
        value=""
        className="peer sr-only"
        onChange={onChange}
      />
      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-800 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
    </label>
  );
};

export const DataFields: FC<{
  text?: string | number | bigint | null;
  label: string;
}> = ({ text, label }) => {
  return (
    <div className=" flex w-full flex-col ">
      <label className=" text-gray-700">{label}:</label>
      <p className=" bg-gray-200 p-1 ">{String(text)}</p>
    </div>
  );
};

export const LoadingAnimation = () => {
  return <SyncLoader color="#312e81" />;
};

export const LoadingCustomer = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 blur-sm">
      <Container>
        <Toggle />
        <ViewCustomer
          customerData={{
            id: "1234567",
            name: "Name Name Name",
            number: BigInt(132424242),
            idNumber: BigInt(132424242),
            mobile: [BigInt(132424242)],
          }}
        />
      </Container>

      <LoadingTable type="small" />
    </div>
  );
};

export const LoadingInvoice = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center  blur-sm">
      <Container>
        <DataFields label="Name" text={"Name Name Name"} />
        <DataFields label="Number" text={"123456789"} />
        <DataFields label="Cost" text={"200"} />
        <DataFields label="Created At" text={"123456789"} />
        <DataFields label="updated At" text={"123456789"} />
        <DataFields label="Created By" text={"123456789"} />
        <DataFields label="Status" text={"Waiting"} />
      </Container>
    </div>
  );
};
