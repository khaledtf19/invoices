import { useState } from "react";
import { PrimaryButton, Input } from "../../components/utils";

const Search = () => {
  const [name, setName] = useState<string>("");
  const [number, setNumber] = useState<string>("");

  return (
    <div className="flex w-full flex-col items-center">
      <div className="m-6 flex w-full max-w-xs flex-col items-center gap-3 rounded-lg border border-black p-6  shadow-2xl drop-shadow-xl">
        <Input name="name" label="Name" setState={setName} state={name} />
        <Input
          name="number"
          label="Number"
          setState={setNumber}
          state={number}
        />
        <div className=" w-full max-w-[100px] ">
          <PrimaryButton type="button" label="Search" />
        </div>
      </div>
      <div>
        <PrimaryButton
          type="button"
          label="Make New Customer"
          onClick={() => {
            console.log("hi");
          }}
        />
        {/* <table className=" border-collapse border border-black">
          <thead className=" border border-black">
            <th className="border border-black">name</th>
            <th className="border border-black">number</th>
          </thead>
          <tbody>
            <td className="border border-black">khaled</td>
            <td className="border border-black">12345</td>
          </tbody>
        </table> */}
      </div>
    </div>
  );
};

export default Search;
