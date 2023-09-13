import {
  type ChangeEventHandler,
  type FC,
  type HTMLInputTypeAttribute,
  useEffect,
  useState,
} from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import type {
  FieldError,
  FieldErrorsImpl,
  Merge,
  UseFormRegisterReturn,
} from "react-hook-form";
import { type IconType } from "react-icons";
import { BsCreditCard2Front } from "react-icons/bs";
import { SyncLoader } from "react-spinners";

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
    <div className="flex w-full flex-col items-start justify-start">
      <label className="text-gray-700" htmlFor={name}>
        {label}:
      </label>
      <input
        type={type ? type : "text"}
        name={name}
        value={state}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-900 p-1 outline-none "
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
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}> = ({ className, type, label, onClick }) => {
  return (
    <button
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
      type={type ? type : "button"}
      className={`w-full rounded-lg bg-blue-900 px-3 py-1 text-white transition-colors duration-500 hover:bg-blue-800 ${className}`}
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
      className=" w-full rounded-lg bg-green-600 px-3 py-1 text-white transition-colors duration-300 hover:bg-green-500"
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
      className=" w-full rounded-lg bg-red-800 px-3 py-1 text-white transition-colors duration-300 hover:bg-red-700"
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
      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-800 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
    </label>
  );
};

export const DataFields: FC<{
  text: string | number | null | undefined;
  label: string;
  Icon?: IconType;
  className?: string;
  iconSize?: number;
}> = ({ text, label, Icon, iconSize, className }) => {
  return (
    <div className=" flex w-full flex-col ">
      <label className=" flex items-center gap-2 text-gray-700">
        {Icon ? (
          <IconToCopy
            name={label}
            Icon={Icon}
            text={String(text)}
            size={iconSize || 20}
          />
        ) : null}
        {label}:
      </label>
      <p className={` bg-gray-300 p-1 ${className}`}>
        {text ? String(text) : "none"}
      </p>
    </div>
  );
};

export const IconToCopy: FC<{
  name: string;
  text: string;
  Icon: IconType;
  size?: number;
}> = ({ Icon, text, size, name }) => {
  const [copied, setCopied] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  }, [copied]);

  return (
    <div
      className={`${
        copied ? " text-green-600" : ""
      } relative flex items-center justify-center`}
      onMouseOver={() => {
        setHover(true);
      }}
      onMouseOut={() => {
        setHover(false);
      }}
    >
      {hover ? (
        <p className=" absolute bottom-8 flex animate-opacityAnimation items-center justify-center  rounded-md bg-white px-3 py-1 text-gray-600 shadow-lg">
          {name}
        </p>
      ) : null}
      <CopyToClipboard text={text} onCopy={() => setCopied(true)}>
        <Icon size={size ? size : 30} />
      </CopyToClipboard>
    </div>
  );
};

export const LoadingAnimation = (props: { color?: string }) => {
  return <SyncLoader color={props.color ? props.color : "#312e81"} />;
};

export const LoadingInvoice = () => {
  return (
    <div className="flex w-full max-w-md animate-pulse flex-col items-center justify-center blur-sm">
      <Container size="max-w-md">
        <DataFields
          label="Name"
          text={"Name Name Name"}
          Icon={BsCreditCard2Front}
        />
        <DataFields
          label="Number"
          text={"123456789"}
          Icon={BsCreditCard2Front}
        />
        <DataFields label="Cost" text={"200"} Icon={BsCreditCard2Front} />
        <DataFields
          label="Created At"
          text={"123456789"}
          Icon={BsCreditCard2Front}
        />
        <DataFields
          label="updated At"
          text={"123456789"}
          Icon={BsCreditCard2Front}
        />
        <DataFields
          label="Created By"
          text={"123456789"}
          Icon={BsCreditCard2Front}
        />
        <DataFields
          label="Viewed"
          text={"Seen by an Admin"}
          Icon={BsCreditCard2Front}
        />
        <DataFields label="Status" text={"Waiting"} Icon={BsCreditCard2Front} />
      </Container>
    </div>
  );
};

export const PageTabs: FC<{
  tabs: {
    tabName: string;
    component: React.ReactNode;
  }[];
}> = ({ tabs }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className=" flex w-full flex-col items-center justify-center ">
      <div className=" flex w-full items-start justify-center gap-2">
        {tabs.map((tab, i) => (
          <div
            key={i}
            className=" flex flex-col items-center"
            onClick={() => {
              setSelectedTab(i);
            }}
          >
            <h1 className=" rounded-md bg-gray-900 p-2 text-xl font-bold text-white ">
              {tab.tabName}
            </h1>
            {selectedTab === i ? (
              <span className=" h-3 w-3 bg-gray-900 p-1" />
            ) : null}
          </div>
        ))}
      </div>
      <div className="flex w-full items-start justify-center rounded-md border border-gray-900 p-1">
        {tabs[selectedTab]?.component}
      </div>
    </div>
  );
};
