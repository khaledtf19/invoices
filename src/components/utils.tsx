import type { ChangeEventHandler, FC, HTMLInputTypeAttribute } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

export const Input: FC<{
  name: string;
  label: string;
  state: string;
  placeholder?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}> = ({ name, label, state, onChange, placeholder }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name}>{label}</label>
      <input
        name={name}
        value={state}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-indigo-900 p-1 outline-none "
      />
    </div>
  );
};

export const FormInput: FC<{
  name: string;
  label: string;
  register: UseFormRegisterReturn<string>;
  error?: string;
  placeholder?: string;
  type: HTMLInputTypeAttribute;
}> = ({ name, label, register, error, type, placeholder }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name}>{label}</label>
      <p className=" text-xs">{error ? error : ""}</p>
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
  type: "button" | "submit" | "reset" | undefined;
}> = ({ type, label, onClick }) => {
  return (
    <button
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      type={type}
      className=" w-full rounded-lg bg-indigo-900 px-3 py-1 text-white hover:bg-indigo-800"
    >
      {label}
    </button>
  );
};
