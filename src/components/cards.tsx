import { useEffect, useState } from "react";

import { useModalState } from "../hooks/modalState";
import { trpc } from "../utils/trpc";
import { Input, LoadingAnimation, PrimaryButton, RedButton } from "./utils";

export function AddOrUpdateCardsModal({ id }: { id?: string }) {
  const [currCost, setCost] = useState("");
  const [currCards, setCards] = useState<number[]>([]);
  const [currCard, setCurrCard] = useState(6);

  const { closeModal, changeComponent } = useModalState((state) => ({
    closeModal: state.closeModal,
    changeComponent: state.changeComponent,
  }));

  const { data: prices, isLoading } = trpc.invoice.getCardsPrices.useQuery();
  const updateCalcById = trpc.invoice.updateCalcCards.useMutation({
    onSuccess: () => {
      closeModal();
      context.invoice.getAllCalc.invalidate();
    },
  });
  const addNewCalc = trpc.invoice.addNewCalcCards.useMutation({
    onSuccess: () => {
      closeModal();
      context.invoice.getAllCalc.invalidate();
    },
  });
  const getCalcById = trpc.invoice.getCalcById.useMutation({
    onSuccess: (data) => {
      setCost(data.cost.toString());
      setCards(data.values as number[]);
    },
  });

  const context = trpc.useUtils();

  useEffect(() => {
    if (id) {
      getCalcById.mutate({ id });
    }
  }, []);

  useEffect(() => {
    setCost(
      currCards
        .reduce((state, curr) => {
          return state + curr;
        }, 0)
        .toString(),
    );
  }, [currCards]);

  if (isLoading || !prices || addNewCalc.isLoading || getCalcById.isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 ">
      <div className="flex items-center justify-center gap-7">
        <Input
          label="Cost"
          type="number"
          state={currCost}
          onChange={() => {
            // const result = e.target.value.replace(/\D/g, "");
            // setCost(result);
          }}
        />
        <div className="flex h-full gap-2  self-end">
          <select
            className="h-8  border border-black px-2"
            defaultValue={currCard}
            value={currCard}
            onChange={(e) => {
              setCurrCard(Number(e.target.value))
            }}
          >
            {prices.map((price) => (
              <option key={price.id} value={price.value}>
                {price.value}
              </option>
            ))}
          </select>
          <button
            className="mb-1 self-end border border-gray-500 bg-green-600 px-2 hover:bg-green-500"
            onClick={() => {
              setCards([...currCards, currCard])

            }}
          >
            +
          </button>
        </div>
      </div>
      <div className="flex min-h-12 w-full flex-wrap gap-2 rounded-md bg-indigo-900 p-2 text-2xl text-white">
        {currCards.map((card, i) => (
          <p
            key={i}
            className="hover:text-red-500"
            onClick={() => {
              const arr = [...currCards];
              arr.splice(i, 1);
              setCards(arr);
            }}
          >
            {i !== 0 && "-"} {card}
          </p>
        ))}
      </div>
      <div className="flex gap-5">
        <PrimaryButton
          label={id ? "update" : "Add"}
          onClick={async () => {
            if (id) {
              updateCalcById.mutate({
                id: id,
                cardsValues: currCards,
                newCost: Number(currCost),
              });
            } else {
              addNewCalc.mutate({
                cardsValues: currCards,
                cost: Number(currCost),
              });
            }
          }}
        />
        {id ? (
          <RedButton
            label="Delete"
            onClick={() => {
              changeComponent({
                newComponent: <DeleteCalcModal id={id} />,
              });
            }}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

function DeleteCalcModal({ id }: { id: string }) {
  const context = trpc.useUtils();

  const { closeModal } = useModalState((state) => ({
    closeModal: state.closeModal,
  }));

  const deleteCalc = trpc.invoice.deleteCalcCard.useMutation({
    onSuccess: () => {
      context.invoice.getAllCalc.invalidate();
      closeModal();
    },
  });

  if (deleteCalc.isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center justify-center gap-5">
      <p className="text-red-500">Do you want to delete this ?</p>
      <div className="w-3/6">
        <RedButton
          label="Delete"
          onClick={() => {
            deleteCalc.mutate({ id });
          }}
        />
      </div>
    </div>
  );
}
