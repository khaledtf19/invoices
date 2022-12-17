import type { Dispatch, FC, SetStateAction } from "react";

export const Input: FC<{
  name: string;
  label: string;
  state: string;
  setState: Dispatch<SetStateAction<string>>;
}> = ({ name, label, state, setState }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name}>{label}</label>
      <input
        name={name}
        value={state}
        onChange={(e) => {
          setState(e.target.value);
        }}
        className=" border border-black outline-none "
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
