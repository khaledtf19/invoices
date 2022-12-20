import { ChangeEvent, useState } from "react";
import { PrimaryButton, Input } from "../../components/utils";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { CustomerTable } from "../../components/tables";

const Search = () => {
  const [name, setName] = useState<string>("");
  const [number, setNumber] = useState<string>("");

  const router = useRouter();

  const search = trpc.customer.search.useMutation();

  const handleSearch = async () => {
    try {
      await search.mutateAsync({ number: Number(number), name: name });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className=" flex w-full max-w-xs flex-col items-center gap-3 rounded-lg border border-indigo-900 p-6  shadow-2xl drop-shadow-xl">
        <Input
          name="name"
          label="Name"
          state={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <Input
          name="number"
          label="Number"
          state={number}
          onChange={(e) => {
            const result = e.target.value.replace(/\D/g, "");
            setNumber(result);
          }}
        />
        <div className=" w-full max-w-[100px] ">
          <PrimaryButton type="button" label="Search" onClick={handleSearch} />
        </div>
      </div>
      <div>
        <PrimaryButton
          type="button"
          label="Make New Customer"
          onClick={() => {
            router.push("/customer");
          }}
        />
      </div>
      <CustomerTable customers={search.data} isLoading={search.isLoading} />
    </div>
  );
};

export default Search;
