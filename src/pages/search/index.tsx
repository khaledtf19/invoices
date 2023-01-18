import { useState } from "react";
import { PrimaryButton, Input } from "../../components/utils";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { CustomerTable } from "../../components/tables";
import Container from "../../container/Container";

const Search = () => {
  const [name, setName] = useState<string>("");
  const [number, setNumber] = useState<string>("");

  const router = useRouter();

  const search = trpc.customer.search.useMutation();

  const handleSearch = async () => {
    try {
      await search.mutateAsync({
        number: BigInt(number) || undefined,
        name: name,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <Container>
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
      </Container>
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
