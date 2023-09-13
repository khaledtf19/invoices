
import { useEffect, useState } from "react";
import { RedButton } from "../../components/utils";
import Container from "../../container/Container";
import { trpc } from "../../utils/trpc";


const Work = () => {
  const [cells, setcells] = useState([0, 0]);
  const [result, setResult] = useState(0);

  const {data}= trpc.bank.getBank.useQuery()

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
    setcells((old) => {
      old[idx] = value;
      return old;
    });
  };


  return (
    <Container>
      <div className="w-full flex flex-col gap-3 items-center">
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
        <div className="w-fit h-fit bg-green-700 text-white px-2 rounded-full cursor-pointer"
          onClick={()=>{
            addCell()
          }}
        >
          +
        </div>
      </div>
    </Container>
  );
};

export default Work;
export const CellContainer: React.FC<{
  updateCell: (p: { idx: number; value: number }) => void;
  removeCell: (p: { idx: number }) => void;
  idx: number;
  value: number
}> = () => {
  return (
    <div className="flex w-full gap-2">
      <input 
        className="w-full border border-gray-900 p-1 outline-none"
      />
      <div className="w-10">
        <RedButton label="X" />
      </div>
    </div>
  );
};

