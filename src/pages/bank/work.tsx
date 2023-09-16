import { BankName } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";

import { RedButton } from "../../components/utils";
import Container from "../../container/Container";
import { BankNameArr } from "../../types/utils.types";
import { trpc } from "../../utils/trpc";

const Work = () => {
  const [cells, setcells] = useState([0, 0]);
  const [result, setResult] = useState(0);
  const [resultType, setResultType] = useState("sum");
  const [bankName, setBankName] = useState<BankName>(BankName.Khadmaty);

  const { data, isSuccess } = trpc.bank.getBank.useQuery();

  const addCell = () => {
    setcells([...cells, 0]);
  };

  const removeCell: (p: { idx: number }) => void = ({ idx }) => {
    setcells(cells.filter((_, i) => (i === idx ? false : true)));
  };

  const updateCell: (p: { idx: number; value: number }) => void = ({
    idx,
    value,
  }) => {
    const tmp = [...cells];
    tmp[idx] = value;
    setcells(tmp);
  };

  useEffect(() => {
    if (!data) return;

    updateCell({
      idx: 0,
      value: data[bankName === "Bss" ? "bss" : "khadmaty"],
    });
  }, [isSuccess, bankName]);

  return (
    <Container>
      <div className="flex w-full flex-col items-center gap-3">
        <div className="w-full h-[50px] flex items-center justify-center">
        {bankName === "Bss" ? (
          <div className=" ">
            <Image src="/we_logo.png" alt="we logo" width={50} height={50} />
          </div>
        ) : (
          <div className=" bg-blue-900 p-1 text-white">
            <Image
              src="/khadmaty_logo.png"
              alt="we logo"
              width={96}
              height={40}
            />
          </div>
        )}
        </div>
        <div className="flex gap-3">
          <select
            onChange={(e) => setBankName(e.target.value as BankName)}
            value={bankName}
            className="rounded-md border border-gray-300 p-2"
          >
            {BankNameArr.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
          <select className="rounded-md border border-gray-300 p-2 text-center">
            <option>+</option>
            <option>-</option>
          </select>
        </div>

        {cells.map((value, idx) => (
          <div className="flex w-full " key={idx}>
            <CellContainer
              idx={idx}
              updateCell={updateCell}
              removeCell={removeCell}
              value={value}
            />
          </div>
        ))}
        {cells.length !== 15 ? (
          <div
            className="h-fit w-fit cursor-pointer rounded-full bg-green-700 px-2 text-white"
            onClick={() => {
              addCell();
            }}
          >
            +
          </div>
        ) : (
          ""
        )}
      </div>
    </Container>
  );
};

export default Work;
export const CellContainer: React.FC<{
  updateCell: (p: { idx: number; value: number }) => void;
  removeCell: (p: { idx: number }) => void;
  idx: number;
  value: number;
}> = ({ removeCell, updateCell, idx, value }) => {
  return (
    <div className="flex w-full gap-2">
      <input
        className="w-full border border-gray-900 p-1 outline-none"
        type="number"
        onChange={(e) => {
          Number(e.target.value)
            ? updateCell({ value: Number(e.target.value), idx: idx })
            : "";
        }}
        value={value}
      />

      {idx === 0 ? (
        ""
      ) : (
        <div className="w-10">
          <RedButton
            label="X"
            onClick={() => {
              removeCell({ idx });
            }}
          />
        </div>
      )}
    </div>
  );
};
